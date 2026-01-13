'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Ghost, ArrowRight, EyeOff, ShieldCheck, MapPin, Zap, Menu, X, Database, Shield, Lock } from 'lucide-react'
import axios from 'axios'
import { userStore } from '@/stores/user-store'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

type AppState = 'LANDING' | 'GENERATING_ID'

const LandingPage = () => {
	const [appState, setAppState] = useState<AppState>('LANDING')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [isProtocolOpen, setIsProtocolOpen] = useState(false)
	const [isEncryptionOpen, setIsEncryptionOpen] = useState(false)
	const router = useRouter()
	const setName = userStore((state) => state.setName)

	useEffect(() => {
		const token = localStorage?.getItem("token");
		if (token) {
			router.push('/dashboard')
		}
	}, [router])

	async function handleJoin() {
		setLoading(true)
		setError(null)
		try {
			const getSession = await axios.get('http://localhost:3000/api/auth/session')
			const data = getSession.data

			if (data && data.name && data.token) {
				setName(data.name.toString())
				localStorage.setItem('token', data.token)
				setAppState('GENERATING_ID')
			} else {
				setError('Failed to get session data')
			}
		} catch (error: any) {
			console.error(error)
			setError(error.response?.data?.message || 'Something went wrong. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen w-full bg-background text-primary font-sans selection:bg-white selection:text-black overflow-x-hidden relative">
			{/* Global Background Grid */}
			<div className="fixed inset-0 bg-grid-pattern bg-grid-sm opacity-[0.05] pointer-events-none z-0" />

			<AnimatePresence mode="wait">
				{appState === 'LANDING' ? (
					<motion.div
						key="landing"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, filter: 'blur(10px)' }}
						className="relative z-10 min-h-screen flex flex-col"
					>
						{/* Landing Navbar */}
						<nav className="absolute top-0 w-full px-6 md:px-8 py-6 flex justify-between items-center z-50">
							<div className="flex items-center gap-2 font-bold tracking-tight select-none">
								<div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
									<Ghost size={18} fill="currentColor" />
								</div>
								<span className="text-foreground hidden sm:inline">SHADOW</span>
							</div>

							{/* Desktop Navbar Links */}
							<div className="hidden md:flex items-center gap-6">
								<button onClick={() => setIsProtocolOpen(true)} className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">PROTOCOL</button>
								<button onClick={() => setIsEncryptionOpen(true)} className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors">ENCRYPTION</button>
								<div className="h-4 w-px bg-border" />
								<button className="text-xs font-mono text-foreground hover:text-accent transition-colors">V1.0.4-STABLE</button>
							</div>

							{/* Mobile Menu Toggle */}
							<button
								onClick={() => setIsMenuOpen(!isMenuOpen)}
								className="md:hidden p-2 text-foreground hover:bg-surface transition-colors"
							>
								{isMenuOpen ? <X size={24} /> : <Menu size={24} />}
							</button>
						</nav>

						{/* Mobile Menu Overlay */}
						<AnimatePresence>
							{isMenuOpen && (
								<motion.div
									initial={{ opacity: 0, x: '100%' }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: '100%' }}
									className="fixed inset-0 z-60 bg-background md:hidden flex flex-col p-8"
								>
									<div className="flex justify-between items-center mb-12">
										<div className="flex items-center gap-2 font-bold tracking-tight">
											<div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center">
												<Ghost size={18} fill="currentColor" />
											</div>
											<span className="text-foreground">SHADOW</span>
										</div>
										<button onClick={() => setIsMenuOpen(false)}>
											<X size={24} className="text-foreground" />
										</button>
									</div>
									<div className="flex flex-col gap-8">
										<button onClick={() => { setIsProtocolOpen(true); setIsMenuOpen(false); }} className="text-2xl font-black tracking-tighter text-foreground uppercase italic text-left">Protocol</button>
										<button onClick={() => { setIsEncryptionOpen(true); setIsMenuOpen(false); }} className="text-2xl font-black tracking-tighter text-foreground uppercase italic text-left">Encryption</button>
										<div className="h-px w-12 bg-border" />
										<span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">v1.0.4-stable</span>
									</div>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Hero Section */}
						<div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 relative">
							<div className="max-w-5xl w-full pt-16 md:pt-20">
								<div className="border-l-2 border-primary pl-6 md:pl-8 mb-8 md:mb-12">
									<div className="flex items-center gap-3 mb-4 md:mb-6">
										<span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded text-[10px] font-mono text-accent uppercase tracking-wider font-bold">
											Beta Access
										</span>
										<span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider hidden sm:inline">
											v2.0.4 Live
										</span>
									</div>
									<h1 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-6 md:mb-8 text-foreground uppercase">
										ANONYMOUS<br />
										<span className="text-muted-foreground/40">PROXIMITY CHAT.</span>
									</h1>
									<p className="text-muted-foreground text-base md:text-xl font-light tracking-tight max-w-lg leading-relaxed mb-4 md:mb-6">
										Connect instantly with people around you without revealing who you are.
										<br className="hidden sm:block" /><span className="text-foreground font-medium">No Email. No Phone Numbers. No Sign-up.</span>
									</p>
									<div className="flex items-center gap-2 mb-6 md:mb-8">
										<Database size={14} className="text-accent" />
										<span className="text-xs font-mono text-accent uppercase tracking-widest font-bold">NO USER DATA STORED</span>
										<span className="text-xs font-mono text-muted-foreground">• Messages auto-delete in 24 hours</span>
									</div>
								</div>

								{error && (
									<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-mono">
										{'>'} ERROR: {error}
									</div>
								)}

								<div className="flex flex-col sm:flex-row gap-4 mb-16 md:mb-24">
									<button
										onClick={handleJoin}
										disabled={loading}
										className="h-16 px-10 bg-primary text-primary-foreground font-bold text-sm tracking-wide hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 group disabled:opacity-50"
									>
										{loading ? 'INITIALIZING...' : 'GET FREE ANONYMOUS ID'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
									</button>
									<button className="h-14 sm:h-16 px-10 border border-border text-muted-foreground font-mono text-xs hover:border-primary hover:text-foreground transition-colors flex items-center justify-center gap-3">
										HOW IT WORKS <EyeOff size={14} />
									</button>
								</div>

								{/* Feature Grid */}
								<div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-border pt-12 pb-12">
									<div className="space-y-4">
										<div className="w-10 h-10 bg-surface flex items-center justify-center mb-2 border border-border">
											<ShieldCheck className="text-foreground" size={20} />
										</div>
										<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">1. Get Anonymous ID</h3>
										<p className="text-sm text-muted-foreground leading-relaxed">
											We generate a cryptographic identity for you instantly. No personal data is ever collected or stored.
										</p>
									</div>
									<div className="space-y-4">
										<div className="w-10 h-10 bg-surface flex items-center justify-center mb-2 border border-border">
											<MapPin className="text-foreground" size={20} />
										</div>
										<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">2. Find Local Chats</h3>
										<p className="text-sm text-muted-foreground leading-relaxed">
											Our location filters show you active rooms within your immediate radius. Connect with your actual neighbors.
										</p>
									</div>
									<div className="space-y-4">
										<div className="w-10 h-10 bg-surface flex items-center justify-center mb-2 border border-border">
											<Zap className="text-foreground" size={20} />
										</div>
										<h3 className="text-sm font-bold text-foreground uppercase tracking-wider">3. Start Chatting</h3>
										<p className="text-sm text-muted-foreground leading-relaxed">
											Jump into conversations instantly. Messages are ephemeral and encrypted. Your privacy is our architecture.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="absolute bottom-8 right-8 text-[10px] font-mono text-muted-foreground hidden md:block text-right">
							ENCRYPTION: ENABLED<br />
							TRACKING: DISABLED
						</div>
					</motion.div>
				) : (
					<motion.div
						key="generating"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="relative z-10 h-screen flex items-center justify-center bg-background"
					>
						<IdentitySequence onComplete={(coords) => {
							if (coords) {
								router.push('/dashboard');
							}
						}} />
					</motion.div>
				)}
			</AnimatePresence>

			{/* Protocol Dialog */}
			<Dialog open={isProtocolOpen} onOpenChange={setIsProtocolOpen}>
				<DialogContent className="bg-background border-border max-w-2xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tighter uppercase">
							<Shield className="text-accent" size={24} />
							Shadow Protocol
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
						<div className="space-y-3">
							<h3 className="text-foreground font-bold uppercase tracking-wide text-xs">How It Works</h3>
							<ul className="space-y-2 list-disc list-inside">
								<li><span className="font-semibold text-foreground">Create Rooms:</span> Broadcast anonymous chat rooms at your current location</li>
								<li><span className="font-semibold text-foreground">Join Nearby Rooms:</span> Discover and connect with active rooms within your radius (5km, 10km, 25km)</li>
								<li><span className="font-semibold text-foreground">Access Any Location:</span> Manually search and join rooms anywhere in the world</li>
								<li><span className="font-semibold text-foreground">Chat Anonymously:</span> All messages are completely anonymous with no user tracking</li>
							</ul>
						</div>
						<div className="space-y-3">
							<h3 className="text-foreground font-bold uppercase tracking-wide text-xs">Privacy Guarantees</h3>
							<ul className="space-y-2 list-disc list-inside">
								<li><span className="font-semibold text-accent">24-Hour Auto-Delete:</span> All messages and rooms are automatically destroyed after 24 hours</li>
								<li><span className="font-semibold text-accent">Zero Data Storage:</span> No user information is ever stored in our database</li>
								<li><span className="font-semibold text-accent">No Sign-up Required:</span> Instant access with cryptographic ID generation</li>
							</ul>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Encryption Dialog */}
			<Dialog open={isEncryptionOpen} onOpenChange={setIsEncryptionOpen}>
				<DialogContent className="bg-background border-border max-w-2xl">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tighter uppercase">
							<Lock className="text-accent" size={24} />
							Encryption & Security
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
						<div className="space-y-3">
							<h3 className="text-foreground font-bold uppercase tracking-wide text-xs">Anonymous Architecture</h3>
							<p>Shadow uses a cryptographic identity system that generates unique, anonymous IDs for each session. Your real identity is never linked to your chat activity.</p>
						</div>
						<div className="space-y-3">
							<h3 className="text-foreground font-bold uppercase tracking-wide text-xs">Data Retention Policy</h3>
							<div className="bg-surface border border-border p-4 space-y-2">
								<div className="flex items-center gap-2">
									<Database size={16} className="text-accent" />
									<span className="font-mono text-xs font-bold text-accent uppercase">NO USER DATA STORED</span>
								</div>
								<ul className="space-y-1 text-xs">
									<li>• Messages: Auto-deleted after 24 hours</li>
									<li>• Rooms: Destroyed after 24 hours of inactivity</li>
									<li>• User Info: Never collected or stored</li>
									<li>• Location Data: Only used for proximity matching, never saved</li>
								</ul>
							</div>
						</div>
						<div className="space-y-3">
							<h3 className="text-foreground font-bold uppercase tracking-wide text-xs">Technical Details</h3>
							<ul className="space-y-2 list-disc list-inside text-xs">
								<li>WebSocket-based real-time communication</li>
								<li>Redis for ephemeral message storage</li>
								<li>GeoJSON location indexing for proximity search</li>
								<li>JWT-based session management (no personal data in tokens)</li>
							</ul>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}

const IdentitySequence = ({ onComplete }: { onComplete: (coords: [number, number] | null) => void }) => {
	const [step, setStep] = useState(0);
	const [locationStatus, setLocationStatus] = useState<'IDLE' | 'REQUESTING' | 'GRANTED' | 'DENIED'>('IDLE');
	const [coords, setCoords] = useState<[number, number] | null>(null);
	const setCoordinates = userStore((state) => state.setCoordinates);

	useEffect(() => {
		const timer = setInterval(() => {
			setStep(s => {
				if (s >= 100) {
					clearInterval(timer);
					return 100;
				}
				return s + 2;
			});
		}, 40);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (step > 20 && locationStatus === 'IDLE') {
			setLocationStatus('REQUESTING');
			navigator.geolocation.getCurrentPosition(
				(pos) => {
					const c: [number, number] = [pos.coords.latitude, pos.coords.longitude];
					setCoordinates(c);
					setCoords(c);
					setLocationStatus('GRANTED');
				},
				() => {
					setLocationStatus('DENIED');
				}
			);
		}
	}, [step, locationStatus, setCoordinates]);

	useEffect(() => {
		if (step === 100 && (locationStatus === 'GRANTED' || locationStatus === 'DENIED')) {
			setTimeout(() => {
				onComplete(coords);
			}, 800);
		}
	}, [step, locationStatus, onComplete, coords]);

	return (
		<div className="w-80">
			<div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-2 uppercase tracking-widest font-bold">
				<span>{locationStatus === 'DENIED' ? 'STALLED: LOCATION_REQUIRED' : 'INITIALIZING_IDENTITY'}</span>
				<span>{step}%</span>
			</div>
			<div className="h-1 bg-surface w-full overflow-hidden relative border border-border">
				<div
					className={`h-full transition-all duration-75 ease-linear ${locationStatus === 'DENIED' ? 'bg-destructive' : 'bg-primary'}`}
					style={{ width: `${step}%` }}
				/>
			</div>
			<div className="mt-6 font-mono text-[10px] space-y-2 uppercase tracking-wider font-bold">
				<div className="flex items-center gap-2">
					<span className={step > 10 ? 'text-foreground' : 'text-muted-foreground/30'}>{step > 10 ? '[OK]' : '[..]'}</span>
					<span className={step > 10 ? 'text-muted-foreground' : 'text-muted-foreground/20'}>Generating secure keypair</span>
				</div>
				<div className="flex items-center gap-2">
					<span className={step > 40 ? 'text-foreground' : 'text-muted-foreground/30'}>{step > 40 ? '[OK]' : '[..]'}</span>
					<span className={step > 40 ? 'text-muted-foreground' : 'text-muted-foreground/20'}>Verifying anonymity protocols</span>
				</div>
				<div className="flex items-center gap-2">
					<span className={locationStatus === 'GRANTED' ? 'text-accent' : locationStatus === 'DENIED' ? 'text-destructive' : 'text-muted-foreground/30'}>
						{locationStatus === 'GRANTED' ? '[OK]' : locationStatus === 'DENIED' ? '[FAIL]' : '[..]'}
					</span>
					<span className={locationStatus === 'REQUESTING' ? 'text-foreground animate-pulse' : locationStatus === 'GRANTED' ? 'text-muted-foreground' : locationStatus === 'DENIED' ? 'text-destructive/50' : 'text-muted-foreground/20'}>
						{locationStatus === 'DENIED' ? 'LOCATION PERMISSION REQUIRED' : 'Synchronizing GPS coordinates'}
					</span>
				</div>

				{locationStatus === 'DENIED' && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="mt-6 p-3 border border-destructive/20 bg-destructive/5 text-destructive/70 text-[9px] leading-normal"
					>
						[WARNING] Proximity chat requires geolocation to function. Please enable location services and refresh the sequence.
					</motion.div>
				)}
			</div>


		</div>
	);
};

export default LandingPage