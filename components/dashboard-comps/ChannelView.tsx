"use client";

import React, { useEffect, useState, useRef } from "react";
import { Channel } from "./ChannelSidebar";
import { Send, MapPin, Signal, Search, Info, ShieldAlert, Radio, UserPlus, User, Hash, Ghost, ArrowRight } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { getSocketConnetion } from "@/lib/socket";
import { userStore } from "@/stores/user-store";
import { motion } from "motion/react"
interface ChannelViewProps {
	channel: Channel | null;
}
interface joinResponse {
	success: boolean,
	joined: boolean,
	message: string
}

interface Message {
	userId: string;
	message: string;
	timestamp: Date;
}

const ChannelView: React.FC<ChannelViewProps> = ({ channel }) => {
	const [isJoined, setIsJoined] = useState(false);
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputText, setInputText] = useState("");
	const [socket, setSocket] = useState<any>(null);
	const userName = userStore((state) => state.name);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();

	const [typingUsers, setTypingUsers] = useState<string[]>([]);
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);
	const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const mutation = useMutation({
		mutationKey: ['joinRoom'],
		mutationFn: (roomId: string) => {
			return axios.post<joinResponse>(`${process.env.NEXT_PUBLIC_API_URL || 'https://seal-app-66ijj.ondigitalocean.app'}/api/room/${roomId}/join`, {}, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
		},
		onSuccess: (response) => {
			if (response.data && response.data.success && response.data.joined) {
				toast.success("Connection established");
				setIsLoadingHistory(true);
				setIsJoined(true);
				queryClient.invalidateQueries({ queryKey: ['allRooms'] });
			} else {
				toast.error(response.data?.message || "Failed to join room");
			}
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Protocol error detected");
		}
	})

	const fetchHistory = React.useCallback(async () => {
		if (!channel) return;
		try {
			setIsLoadingHistory(true)
			const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://seal-app-66ijj.ondigitalocean.app'}/api/message/${channel.id}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`
				}
			})
			if (res.data.success && res.data.messages) {
				const history = res.data.messages.reverse().map((msg: any) => ({
					userId: msg.userId,
					message: msg.content,
					timestamp: new Date(msg.createdAt)
				}))
				setMessages(history)
			}
		} catch (error) {
			console.error("Failed to fetch history:", error)
		} finally {
			setIsLoadingHistory(false)
		}
	}, [channel?.id]);

	useEffect(() => {
		if (channel) {
			setMessages([]);
			setTypingUsers([]);

			if (channel.joined) {
				setIsLoadingHistory(true);
				setIsJoined(true);
			} else {
				axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://seal-app-66ijj.ondigitalocean.app'}/api/room/${channel.id}/membership`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`
					}
				}).then(res => {
					if (res.data.success && res.data.joined) {
						setIsLoadingHistory(true);
						setIsJoined(true);
					} else {
						setIsJoined(false);
					}
				}).catch(() => {
					setIsJoined(false);
				});
			}
		}
	}, [channel?.id]);

	useEffect(() => {
		if (isJoined && channel) {
			fetchHistory();
		}
	}, [isJoined, channel?.id, fetchHistory]);

	useEffect(() => {
		if (isJoined && channel) {
			const token = localStorage.getItem('token');
			if (!token) return;

			const newSocket = getSocketConnetion(token);
			setSocket(newSocket);

			newSocket.emit("join_room", channel.id);

			newSocket.on("receive_message", (data: Message) => {
				setMessages((prev) => [...prev, data]);
			});

			newSocket.on("user_typing", ({ userId }: { userId: string }) => {
				setTypingUsers((prev) => prev.includes(userId) ? prev : [...prev, userId]);
			});

			newSocket.on("user_stopped_typing", ({ userId }: { userId: string }) => {
				setTypingUsers((prev) => prev.filter((id) => id !== userId));
			});

			return () => {
				newSocket.disconnect();
			};
		}
	}, [isJoined, channel]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, typingUsers]);

	const handleJoin = () => {
		if (channel) {
			mutation.mutate(channel.id);
		}
	};

	const handleSendMessage = (e: React.FormEvent) => {
		e.preventDefault();
		if (socket && inputText.trim() && channel) {
			socket.emit("send_message", channel.id, inputText);
			setInputText("");
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
				socket.emit("typing_stop", channel.id);
				typingTimeoutRef.current = null;
			}
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputText(e.target.value);
		if (socket && channel) {
			if (!typingTimeoutRef.current) {
				socket.emit("typing_start", channel.id);
			}
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
			typingTimeoutRef.current = setTimeout(() => {
				socket.emit("typing_stop", channel.id);
				typingTimeoutRef.current = null;
			}, 2000);
		}
	};

	if (!channel) {
		return (
			<div className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden selection:bg-white selection:text-black">
				<div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-[0.02] pointer-events-none" />

				{/* DECORATIVE ELEMENTS */}


				<motion.div
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className="relative z-10 flex flex-col items-center"
				>
					<div className="w-20 h-20 border border-border flex items-center justify-center mb-10 relative group bg-surface/50 backdrop-blur-sm">
						<div className="absolute inset-0 border border-primary/0 group-hover:border-primary/20 transition-all duration-500 scale-90 group-hover:scale-110" />
						<Radio size={32} className="text-muted-foreground group-hover:text-foreground transition-all duration-500" />



					</div>

					<div className="space-y-4 text-center">
						<motion.h2
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="text-4xl font-black tracking-tighter text-foreground uppercase italic"
						>
							Say Hey <span className="text-accent underline decoration-foreground/10 underline-offset-8">{userName || 'Stranger'}</span>
						</motion.h2>

						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="flex flex-col items-center space-y-2"
						>
							<p className="text-muted-foreground text-[11px] font-mono uppercase tracking-[0.4em] max-w-sm leading-relaxed">
								SIGNAL_IDLE: Awaiting transmission sequence
							</p>
							<div className="h-px w-12 bg-border" />
							<p className="text-secondary text-[10px] font-mono uppercase tracking-widest max-w-[280px] leading-loose">
								Don&apos;t just linger in the shadow buffer.
								<br /> <span className="opacity-60">Broadcast your frequency</span> or dissolve into the static.
							</p>
						</motion.div>
					</div>


				</motion.div>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col bg-background h-full overflow-hidden relative selection:bg-white selection:text-black">
			{/* Background Grid - Very Subtle */}
			<div className="absolute inset-0 bg-grid-pattern bg-grid-sm opacity-[0.03] pointer-events-none" />

			{/* HEADER - Updated with proper z-index and blur */}
			<header className="px-4 md:px-8 h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-40">
				<div className="flex items-center gap-3 md:gap-4 overflow-hidden">
					<div className={`p-1.5 md:p-2 bg-primary/10 border border-primary/20 rounded-none text-primary`}>
						<Hash size={16} />
					</div>
					<div className="flex flex-col min-w-0">
						<div className="flex items-center gap-2">
							<h1 className="text-base md:text-lg font-black tracking-tighter truncate uppercase italic text-foreground">
								{channel.name}
							</h1>
							<div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse shadow-[0_0_8px_var(--accent)] shrink-0" />
						</div>
						<div className="flex items-center gap-2 md:gap-4 font-mono text-[10px] md:text-[11px] text-muted-foreground uppercase opacity-60">
							<span className="flex items-center gap-1.5"><Radio size={12} className="text-accent" /> {channel.totalOnline || 0} online</span>
							<span className="opacity-30">|</span>
							<span className="flex items-center gap-1.5"><User size={12} /> {channel.totalMembers || 0} joined</span>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2 md:gap-4">
					<div className="hidden sm:flex flex-col items-end font-mono text-[9px] text-muted-foreground pr-2 border-r border-border">
						<span className="uppercase tracking-widest">Protocol</span>
						<span className="text-foreground/50">v4.0.2-SECURE</span>
					</div>
					{isJoined ? (
						<div className="px-2 md:px-3 py-1.5 bg-accent/10 border border-accent/20 text-accent text-[9px] md:text-[10px] font-mono font-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.05)]">
							Authenticated
						</div>
					) : (
						<button
							onClick={handleJoin}
							className="px-4 md:px-6 py-2 bg-primary text-primary-foreground text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary/90 transition-all shadow-[0_4px_15px_rgba(255,255,255,0.1)] active:scale-95"
						>
							Initialize Session
						</button>
					)}
				</div>
			</header>

			{/* CHAT AREA */}
			<div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 custom-scrollbar scroll-smooth">
				{!isJoined ? (
					<div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6 md:space-y-8 animate-in fade-in zoom-in duration-500">
						<div className="relative">
							<div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
							<div className="relative w-20 md:w-24 h-20 md:h-24 bg-surface border border-border flex items-center justify-center -rotate-3 hover:rotate-0 transition-transform duration-500 group">
								<Ghost className="text-foreground group-hover:text-primary transition-colors" size={40} />
							</div>
						</div>
						<div className="space-y-3">
							<h3 className="text-lg md:text-2xl font-black tracking-tighter uppercase italic text-foreground">
								Locked Signal Detected
							</h3>
							<p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
								You're eavesdropping on <span className="text-foreground font-mono font-bold bg-zinc-900 dark:bg-zinc-100 dark:text-black px-1.5 py-0.5 border border-white/10 uppercase tracking-tighter">{channel.name}</span>.
								Initialize your session to participate.
							</p>
						</div>
						<button
							onClick={handleJoin}
							className="w-full h-14 md:h-16 bg-primary text-primary-foreground font-bold text-xs md:text-sm tracking-[0.3em] uppercase hover:bg-primary/90 transition-all flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(255,255,255,0.1)] group active:scale-95"
						>
							Unlock Frequency <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
						</button>
					</div>
				) : messages.length === 0 && typingUsers.length === 0 ? (
					<div className="h-full flex flex-col items-center justify-center text-center opacity-40 select-none">
						<div className="w-16 h-16 border border-border/50 flex items-center justify-center mb-6 rotate-12 bg-surface/30">
							<Radio className="text-zinc-500" size={32} />
						</div>
						<p className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-foreground font-bold mb-2">
							Signal Established.
						</p>
						<p className="text-[10px] md:text-[11px] font-mono text-muted-foreground max-w-[200px] md:max-w-xs leading-loose">
							{channel.name} is currently silent.
							<br />Try not to say anything boring.
						</p>
					</div>
				) : (
					<div className="space-y-6 md:space-y-8 max-w-3xl mx-auto">
						{messages.map((msg, i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								className={`flex flex-col ${msg.userId === userName ? "items-end" : "items-start"}`}
							>
								<div className="flex items-center gap-2 mb-2 font-mono text-[9px] md:text-[10px]">
									<span className="text-accent font-black">{msg.userId === userName ? "YOU" : msg.userId.toUpperCase()}</span>
									<span className="text-muted-foreground opacity-30">|</span>
									<span className="text-muted-foreground font-medium">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
								</div>
								<div
									className={`max-w-[90%] md:max-w-[80%] p-3.5 md:p-4 border shadow-sm transition-all duration-300 ${msg.userId === userName
										? "bg-primary text-primary-foreground border-transparent shadow-[0_5px_15px_rgba(0,0,0,0.1)] dark:shadow-[0_5px_15px_rgba(255,255,255,0.05)]"
										: "bg-surface text-foreground border-border hover:border-border/80"
										}`}
								>
									<p className="text-sm md:text-base leading-relaxed tracking-tight wrap-break-word font-medium">
										{msg.message}
									</p>
								</div>
							</motion.div>
						))}
						{typingUsers.length > 0 && (
							<div className="text-[10px] font-mono text-accent animate-pulse flex items-center gap-2 py-2">
								<span className="w-1.5 h-4 bg-accent" />
								INCOMING TRANSMISSION FROM {typingUsers.length === 1 ? typingUsers[0].substring(0, 8) : 'MULTIPLE NODES'}...
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* INPUT AREA */}
			<div className="p-4 md:p-8 bg-background/50 backdrop-blur-md">
				<div className="max-w-3xl mx-auto group">
					<form
						onSubmit={handleSendMessage}
						className="relative flex items-center"
					>
						<input
							type="text"
							value={inputText}
							onChange={handleInputChange}
							disabled={!isJoined}
							placeholder={isJoined ? `Transmit to ${channel.name}...` : "Session required..."}
							className="w-full bg-surface border border-border py-4 md:py-5 pl-5 md:pl-6 pr-16 md:pr-20 text-sm md:text-base text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 transition-all font-medium disabled:opacity-50"
						/>
						<button
							type="submit"
							disabled={!inputText.trim() || !isJoined}
							className="absolute right-3 md:right-4 p-2.5 md:p-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 disabled:grayscale group"
						>
							<Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
						</button>
					</form>
					{isJoined && (
						<div className="mt-3 flex items-center justify-between px-1">
							<div className="flex items-center gap-3">
								<span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
								<span className="text-[9px] md:text-[10px] font-mono text-muted-foreground uppercase tracking-widest font-bold">Secure Link Active</span>
							</div>
							<span className="text-[9px] md:text-[10px] font-mono text-white/20 uppercase font-black italic">Shadow Protocol V4</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChannelView;
