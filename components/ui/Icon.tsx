import React from 'react';

type IconName = 'logo' | 'team' | 'ip' | 'dd' | 'market' | 'traction' | 'gump' | 'stealth' | 'fluency' | 'regulation' | 'horizon' | 'info' | 'pulse' | 'send' | 'cto' | 'cfo' | 'cmo' | 'wizard' | 'score-details' | 'diligence' | 'calculation' | 'saved' | 'action' | 'action-plan' | 'user-profile' | 'documentation' | 'roadmap' | 'vaults' | 'share' | 'trash' | 'verified' | 'analyze' | 'discovery' | 'default';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const icons: Record<IconName, React.ReactNode> = {
    logo: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    team: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    ip: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.5 7.5a2.5 2.5 0 0 1 5 0" /><path d="M5 7.5a2.5 2.5 0 0 1 5 0" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.831-.125 2.699-.363" /><path d="M16 16c-1.5 1.5-3.5 2.5-5.5 2.5" /><path d="M20 10.5c0-1.5-1-2.5-2.5-2.5" /><path d="M3.5 10.5c0-1.5 1-2.5 2.5-2.5" />
      </svg>
    ),
    dd: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    market: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12V7H5" /><path d="M18 5v14" /><path d="M12 5v14" /><path d="M6 5v14" /><path d="M3 5v14" /><path d="M21 12a9 9 0 0 0-9 9" />
      </svg>
    ),
    traction: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
      </svg>
    ),
    gump: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4A2 2 0 0 1 6.5 2z" />
      </svg>
    ),
    stealth: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1.5 12.5l3-3-3-3" /><path d="M13.5 3.5l3 3-3 3" /><path d="M8.5 12.5l3-3-3-3" /><path d="M18.5 3.5l3 3-3 3" /><path d="M1.5 20.5l3-3-3-3" /><path d="M13.5 11.5l3 3-3 3" /><path d="M8.5 20.5l3-3-3-3" /><path d="M18.5 11.5l3 3-3 3" />
      </svg>
    ),
    fluency: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    regulation: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v18" /><path d="M12 3l4 4" /><path d="M12 3L8 7" /><path d="M12 21l4-4" /><path d="M12 21l-4-4" />
      </svg>
    ),
    horizon: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
      </svg>
    ),
    info: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
    pulse: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    send: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
    ),
    cto: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="12" y1="4" x2="12" y2="20" />
        </svg>
    ),
    cfo: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    ),
    cmo: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    ),
    wizard: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3L3 5" /><path d="M12 3L10 5" /><path d="M19 3L21 5" /><path d="M5 21L3 19" /><path d="M12 21L10 19" /><path d="M19 21L21 19" /><path d="M21 12L19 10" /><path d="M21 12L19 14" /><path d="M3 12L5 10" /><path d="M3 12L5 14" /><path d="M12 6V3" /><path d="M12 21V18" /><path d="M12 12L18 15L12 18L6 15L12 12Z" />
        </svg>
    ),
    'score-details': (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><polyline points="21 17 16 12 21 7" />
        </svg>
    ),
    diligence: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 12c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z" /><path d="M20.25 12c0-4.56-3.69-8.25-8.25-8.25S3.75 7.44 3.75 12s3.69 8.25 8.25 8.25 8.25-3.69 8.25-8.25z" /><line x1="12" y1="18" x2="12" y2="21" /><line x1="12" y1="3" x2="12" y2="6" /><line x1="6" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="18" y2="12" />
        </svg>
    ),
    calculation: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 7V4h3" /><path d="M9 10.14A6.49 6.49 0 0 0 5.22 6.22" /><path d="M20 7h-3V4" /><path d="M14.86 10.24A6.49 6.49 0 0 0 18.78 6.22" /><path d="M4 17v3h3" /><path d="M9.14 14A6.49 6.49 0 0 0 5.22 17.78" /><path d="M20 17h-3v3" /><path d="M14.86 13.86A6.49 6.49 0 0 0 18.78 17.78" />
        </svg>
    ),
    saved: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
    ),
    action: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-4.44l-3 9 9-3-9 9 9-3-9 9h4.44l3-9-9 3 9-9-9-3 9-9z" />
        </svg>
    ),
    'action-plan': (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15.5 2.5a2.5 2.5 0 0 1 5 0" /><path d="M12 12a5 5 0 0 1 5 5" /><path d="M12 2a5 5 0 0 1 5 5" /><path d="M7 12a5 5 0 0 0-5 5" /><path d="M22 12a5 5 0 0 0-5-5" /><path d="M12 12a5 5 0 0 1-5 5" /><path d="M12 22a5 5 0 0 1-5-5" /><path d="M12 12a5 5 0 0 0-5-5" /><path d="M2 12a5 5 0 0 0 5 5" />
        </svg>
    ),
    'user-profile': (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    ),
    documentation: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
        </svg>
    ),
    roadmap: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    ),
    vaults: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
    ),
    share: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
        </svg>
    ),
    trash: (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    ),
    verified: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    analyze: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <circle cx="10.5" cy="14.5" r="2.5" />
        <line x1="12.5" y1="16.5" x2="15" y2="19" />
      </svg>
    ),
    discovery: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
        <path d="M12 2a10 10 0 0 0-3.16 19.4" />
        <path d="M12 2a10 10 0 0 1 3.16 19.4" />
      </svg>
    ),
    default: (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  };

  return icons[name] || icons.default;
};
