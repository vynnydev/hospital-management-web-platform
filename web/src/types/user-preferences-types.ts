// types/user-preferences-types.ts
export interface UserPreferences {
    id: string;
    userId: string;
    theme: 'system' | 'light' | 'dark';
    layout: {
        compactSidebar: boolean;
        transparentSidebar: boolean;
        showHeader: boolean;
        tableView: 'default' | 'compact';
    };
    branding: {
        brandColor: string;
        useLogo: boolean;
        customLogoUrl?: string;
    };
    accessibility: {
        highContrast: boolean;
        visualAlerts: boolean;
        closedCaptions: boolean;
        textSize: 'small' | 'medium' | 'large';
    };
    notifications: {
        email: boolean;
        inApp: boolean;
        desktop: boolean;
        mobile: boolean;
        categories: {
        [key: string]: boolean;
        };
    };
}