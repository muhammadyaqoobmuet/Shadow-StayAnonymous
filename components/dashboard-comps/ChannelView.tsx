"use client";

import React from "react";
import { Channel } from "./ChannelSidebar";
import { Send, UserPlus, Shield, Info, MoreVertical, Search } from "lucide-react";

interface ChannelViewProps {
	channel: Channel | null;
}

const ChannelView: React.FC<ChannelViewProps> = ({ channel }) => {
	if (!channel) {
		return (
			<div className="flex-1 flex flex-col items-center justify-center bg-gray-50/30 text-center p-8">
				<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
					<Send className="w-10 h-10 text-gray-300" />
				</div>
				<h3 className="text-xl font-semibold text-gray-800">Select a channel</h3>
				<p className="text-gray-500 mt-2 max-w-xs mx-auto">
					Choose a channel from the left sidebar to view its details and join the conversation.
				</p>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col bg-[#0B0E11] h-full overflow-hidden relative">
			{/* Telegram-style Header */}
			<div className="h-16 border-b border-white/5 flex items-center justify-between px-6 shrink-0 bg-black/40 backdrop-blur-md">
				<div className="flex items-center gap-4">
					<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
						{channel.initials}
					</div>
					<div>
						<h3 className="font-bold text-white leading-tight">{channel.name}</h3>
						<p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
							<span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
							active
						</p>
					</div>
				</div>
				<div className="flex items-center gap-4 text-gray-500">
					<button className="hover:text-primary transition-colors">
						<Search className="w-5 h-5" />
					</button>
					<button className="hover:text-primary transition-colors">
						<MoreVertical className="w-5 h-5" />
					</button>
				</div>
			</div>

			{/* Content Area */}
			<div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center">
				<div className="max-w-2xl w-full space-y-8">
					<div className="flex flex-col items-center text-center space-y-6">
						<div className="w-24 h-24 rounded-[32px] bg-linear-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl">
							{channel.initials}
						</div>
						<div>
							<h1 className="text-4xl font-black text-white">{channel.name}</h1>
							<p className="text-gray-500 mt-2 text-lg">@{channel.name.toLowerCase().replace(/\s+/g, '_')}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Full-width Join Button */}
			<div className=" border-t border-white/5 bg-black/40 backdrop-blur-md">
				<button className="w-full bg-gray-200 text-black py-4  font-black text-lg shadow-2xl hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
					<UserPlus className="w-6 h-6" />
					JOIN NOW
				</button>
			</div>
		</div>
	);
};


export default ChannelView;
