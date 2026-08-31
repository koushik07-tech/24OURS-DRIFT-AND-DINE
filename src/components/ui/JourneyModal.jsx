import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

export default function JourneyModal({ isOpen, onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const interestOptions = [
    { id: 'karting', label: 'Go-Karting & Track Days' },
    { id: 'skydining', label: '360° Sky Dining & Lounge' },
    { id: 'events', label: 'Banquets & Private Celebrations' },
    { id: 'vr_gaming', label: 'VR Arena & Arcade Gaming' },
    { id: 'meets', label: 'Automotive Meets & Screenings' },
  ];

  const handleToggleInterest = (id) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          interests,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      // Fallback grace for offline/dev
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setErrorMessage('');
    setName('');
    setEmail('');
    setInterests([]);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isSubmitted ? handleReset : onClose}
      title={isSubmitted ? "You're on the Grid!" : "Follow the 24OURS Journey"}
      subtitle={isSubmitted ? "Pre-Launch Access Granted" : "VIP Updates & Early Previews"}
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-carbon-300">
            Be the first to see behind-the-scenes construction milestones, track unveilings, and exclusive invitations before the public opening in Malur, Kolar, Karnataka.
          </p>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/60 border border-brand-red/50 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 text-brand-red shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label htmlFor="name" className="block text-xs font-mono text-carbon-400 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-4 py-2.5 bg-carbon-950 border border-white/10 rounded-lg text-white placeholder-carbon-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red text-sm transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-mono text-carbon-400 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-brand-red">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full px-4 py-2.5 bg-carbon-950 border border-white/10 rounded-lg text-white placeholder-carbon-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-carbon-400 uppercase tracking-wider mb-2">
                Experiences You're Most Excited About:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {interestOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleInterest(opt.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-all border ${
                      interests.includes(opt.id)
                        ? 'bg-brand-red/15 border-brand-red text-white font-medium'
                        : 'bg-carbon-950/60 border-white/5 text-carbon-400 hover:text-carbon-200 hover:border-white/20'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] border ${
                        interests.includes(opt.id)
                          ? 'bg-brand-red border-brand-red text-white'
                          : 'border-white/30'
                      }`}
                    >
                      {interests.includes(opt.id) && '✓'}
                    </span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              icon={isLoading ? Loader2 : Send}
              className="w-full justify-center shadow-glow-red"
            >
              {isLoading ? 'Registering...' : 'Get Milestone Updates'}
            </Button>
          </div>

          <p className="text-[11px] text-center text-carbon-500 font-mono">
            No spam. Only key developmental milestones and pre-launch previews.
          </p>
        </form>
      ) : (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-red/15 border border-brand-red flex items-center justify-center mx-auto text-brand-red shadow-glow-red">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h4 className="text-xl font-display font-bold text-white">
              Welcome to the 24OURS Paddock!
            </h4>
            <p className="text-sm text-carbon-300 max-w-sm mx-auto">
              Thank you, <span className="text-white font-semibold">{name || 'Racer'}</span>. We've recorded your interests and will send pre-launch updates to <span className="text-brand-red font-mono">{email}</span>.
            </p>
          </div>

          <div className="pt-4">
            <Button
              variant="secondary"
              size="md"
              onClick={handleReset}
              className="w-full justify-center"
            >
              Back to Exploration
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
