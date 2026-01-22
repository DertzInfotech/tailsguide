import { faHeart, faQrcode, faSearch, faBuilding, faTrophy, faBell } from "@fortawesome/free-solid-svg-icons";

// Hero Stats Data
export const heroStatsInfo = [
    {
        number: '2,847',
        label: 'Pets Reunited'
    },
    {
        number: '87%',
        label: 'Success Rate'
    },
    {
        number: '18hrs',
        label: 'Avg. Reunion Time'
    }
];

// Main Action Tiles Data
export const mainTilesInfo = [
    {
        title: 'Report Lost & Found Pet',
        description: 'Lost your furry friend? Get help from our community.',
        link: '/report',
        icon: faSearch
    },
    {
        title: 'Find & Reunite',
        description: 'Help a lost pet find their way home.',
        link: '/search',
        icon: faHeart
    },
    {
        title: 'Scan QR Code',
        description: 'Instant pet identification and owner contact.',
        link: '/scan',
        icon: faQrcode
    },
    {
        title: 'Shelter Portal',
        description: 'Manage intake, care, and adoptions.',
        link: '/shelters',
        icon: faBuilding,
        customIcon: (
            <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" />
            </svg>
        )
    }
];

// Section Headers Data
export const sectionHeadersInfo = [
    {
        title: 'Active Alerts',
        icon: faBell,
        customIcon: (
            <svg
                className="w-10 h-10 text-orange-500"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
            </svg>
        )
    },
    {
        title: 'Recent Success Stories',
        icon: faTrophy
    }
];

// Bottom Stats Cards Data
export const statsCardsInfo = [
    {
        number: '89',
        label: 'Partner Shelters',
        icon: (
            <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
        )
    },
    {
        number: '1,234',
        label: 'Active Volunteers',
        icon: (
            <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
        )
    },
    {
        number: '156',
        label: 'Active Alerts',
        icon: (
            <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
            </svg>
        )
    },
    {
        number: '87%',
        label: 'Success Rate',
        icon: (
            <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
            </svg>
        )
    }
];