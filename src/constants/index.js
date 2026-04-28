const navLinks = [
    {
        id: 1,
        name: "Projects",
        type: "finder",
    },
    {
        id: 3,
        name: "Contact",
        type: "contact",
    },
    {
        id: 4,
        name: "Resume",
        type: "resume",
    },
];

const navIcons = [
    {
        id: 1,
        img: "/icons/wifi.svg",
    },
    {
        id: 2,
        img: "/icons/search.svg",
    },
    {
        id: 3,
        img: "/icons/user.svg",
    },
    {
        id: 4,
        img: "/icons/mode.svg",
    },
];

const dockApps = [
    {
        id: "finder",
        name: "Portfolio",
        icon: "finder.png",
        canOpen: true,
    },
    {
        id: "safari",
        name: "Articles",
        icon: "safari.png",
        canOpen: true,
    },
    {
        id: "photos",
        name: "Gallery",
        icon: "photos.png",
        canOpen: true,
    },
    {
        id: "contact",
        name: "Contact",
        icon: "contact.png",
        canOpen: true,
    },
    {
        id: "terminal",
        name: "Skills",
        icon: "terminal.png",
        canOpen: true,
    },
    {
        id: "spotify",
        name: "Spotify",
        icon: "spotify.png",
        canOpen: true,
    },
    {
        id: "youtube",
        name: "YouTube",
        icon: "youtube.png",
        canOpen: true,
    },
    {
        id: "steam",
        name: "Steam",
        icon: "steam.png",
        canOpen: true,
    },
    {
        id: "tiktok",
        name: "TikTok",
        icon: "tiktok.png",
        canOpen: true,
    },
];

const blogPosts = [
    {
        id: 1,
        date: "Sep 2, 2025",
        title:
            "TypeScript Explained: What It Is, Why It Matters, and How to Master It",
        image: "/images/blog1.png",
        link: "https://jsmastery.com/blog/typescript-explained-what-it-is-why-it-matters-and-how-to-master-it",
    },
    {
        id: 2,
        date: "Aug 28, 2025",
        title: "The Ultimate Guide to Mastering Three.js for 3D Development",
        image: "/images/blog2.png",
        link: "https://jsmastery.com/blog/the-ultimate-guide-to-mastering-three-js-for-3d-development",
    },
    {
        id: 3,
        date: "Aug 15, 2025",
        title: "The Ultimate Guide to Mastering GSAP Animations",
        image: "/images/blog3.png",
        link: "https://jsmastery.com/blog/the-ultimate-guide-to-mastering-gsap-animations",
    },
];

const techStack = [
    {
        category: "Frontend",
        items: ["React.js", "Next.js", "TypeScript"],
    },
    {
        category: "Mobile",
        items: ["React Native", "Expo", "Java"],
    },
    {
        category: "Styling & UI",
        items: ["Tailwind CSS", "CSS", "GSAP", "Bootstrap"],
    },
    {
        category: "Backend",
        items: ["Node.js", "Java", "Hibernate", "PHP"],
    },
    {
        category: "Database",
        items: ["MongoDB", "MySQL", "SQLite", "Firebase"],
    },
    {
        category: "Tools & Cloud",
        items: ["Git", "GitHub", "Netlify", "Vercel"],
    },
    {
        category: "Creative tools",
        items: ["Unity", "Photoshop", "After Effects"],
    },
    {
        category: "Hardware",
        items: ["Arduino"],
    }
];

const socials = [
    {
        id: 1,
        text: "Github",
        icon: "/icons/github.svg",
        bg: "#f4656b",
        link: "https://github.com/Bl4ke100",
    },
    {
        id: 2,
        text: "Email",
        icon: "/icons/email.svg",
        bg: "#4bcb63",
        link: "mailto:janindumagamage100@gmail.com",
    },
    {
        id: 4,
        text: "LinkedIn",
        icon: "/icons/linkedin.svg",
        bg: "#05b6f6",
        link: "https://www.linkedin.com/in/janindu-magamage-b630613ba/",
    },
];

const photosLinks = [
    {
        id: 1,
        icon: "/icons/gicon1.svg",
        title: "Library",
    },
    {
        id: 2,
        icon: "/icons/gicon2.svg",
        title: "Memories",
    },
    {
        id: 3,
        icon: "/icons/file.svg",
        title: "Places",
    },
    {
        id: 4,
        icon: "/icons/gicon4.svg",
        title: "People",
    },
    {
        id: 5,
        icon: "/icons/gicon5.svg",
        title: "Favorites",
    },
];

const gallery = [
    {
        id: 1,
        img: "/images/gal1.png",
    },
    {
        id: 2,
        img: "/images/gal2.png",
    },
    {
        id: 3,
        img: "/images/gal3.png",
    },
    {
        id: 4,
        img: "/images/gal4.png",
    },
];

export {
    navLinks,
    navIcons,
    dockApps,
    blogPosts,
    techStack,
    socials,
    photosLinks,
    gallery,
};

const WORK_LOCATION = {
    id: 1,
    type: "work",
    name: "Work",
    icon: "/icons/work.svg",
    kind: "folder",
    children: [
        // ▶ Project 1: GameVault Web
        {
            id: 5,
            name: "GameVault Web",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-10 left-5",
            windowPosition: "top-[5vh] left-5",
            children: [
                {
                    id: 1,
                    name: "GameVault Web.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 left-10",
                    description: [
                        "GameVault Web is a digital storefront designed specifically for browsing and purchasing game products.",
                        "It focuses on delivering a sleek, modern UI with smooth navigation to enhance the shopping experience.",
                    ],
                },
                {
                    id: 2,
                    name: "github.com",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Bl4ke100/GameVault_Web",
                    position: "top-10 right-20",
                },
                {
                    id: 4,
                    name: "gamevault-web.png",
                    icon: "/images/gamevault-web.png",
                    kind: "file",
                    fileType: "img",
                    position: "top-52 right-80",
                    imageUrl: "/images/gamevault-web.png",
                },
            ],
        },

        // ▶ Project 2: GameVault Mobile
        {
            id: 6,
            name: "GameVault Mobile",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-52 right-80",
            windowPosition: "top-[20vh] left-7",
            children: [
                {
                    id: 1,
                    name: "GameVault Mobile.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 right-10",
                    description: [
                        "GameVault Mobile is the m-commerce companion app for digital game products.",
                        "Developed as part of my academic coursework, it brings the complete digital storefront experience natively to mobile devices.",
                    ],
                },
                {
                    id: 2,
                    name: "github.com",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Bl4ke100/GameVault-Mobile",
                    position: "top-20 left-20",
                },
                {
                    id: 4,
                    name: "gamevault-mobile.png",
                    icon: "/images/gamevault-mobile.png",
                    kind: "file",
                    fileType: "img",
                    position: "top-52 left-80",
                    imageUrl: "/images/gamevault-mobile.png",
                },
            ],
        },

        // ▶ Project 3: Flow Chat App
        {
            id: 7,
            name: "Flow Chat Application",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-10 left-80",
            windowPosition: "top-[33vh] left-7",
            children: [
                {
                    id: 1,
                    name: "Flow App.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 left-10",
                    description: [
                        "Flow is a real-time mobile chat application built for fast and seamless communication.",
                        "It features a highly responsive React Native frontend paired with a robust and scalable Java Servlet backend.",
                    ],
                },
                {
                    id: 2,
                    name: "Frontend Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Bl4ke100/Flow---React-Native-Chat-Application-",
                    position: "top-10 right-20",
                },
                {
                    id: 3,
                    name: "Backend Repo",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Bl4ke100/Flow---React-Native-Chat-Application-Backend",
                    position: "top-30 right-20",
                },
                {
                    id: 4,
                    name: "flow-preview.png",
                    icon: "/images/flow.png",
                    kind: "file",
                    fileType: "img",
                    position: "top-52 right-80",
                    imageUrl: "/images/flow.png",
                },
            ],
        },

        // ▶ Project 4: Huros Ecommerce
        {
            id: 8,
            name: "Huros Ecommerce",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-52 left-20",
            windowPosition: "top-[15vh] left-50",
            children: [
                {
                    id: 1,
                    name: "Huros Project.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 left-10",
                    description: [
                        "Huros is a full-featured e-commerce web application tailored for modern online retail.",
                        "It includes complete product browsing, cart management, and user checkout flows.",
                    ],
                },
                {
                    id: 2,
                    name: "github.com",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Bl4ke100/Huros-Ecommerce_web-app",
                    position: "top-10 right-20",
                },
                {
                    id: 4,
                    name: "huros.png",
                    icon: "/images/image.png",
                    kind: "file",
                    fileType: "img",
                    position: "top-52 right-80",
                    imageUrl: "/images/huros.png",
                },
            ],
        },

        // ▶ Project 5: School Management System
        {
            id: 9,
            name: "School Management System",
            icon: "/images/folder.png",
            kind: "folder",
            position: "top-[20rem] left-5",
            windowPosition: "top-[25vh] left-[20vw]",
            children: [
                {
                    id: 1,
                    name: "SMS Details.txt",
                    icon: "/images/txt.png",
                    kind: "file",
                    fileType: "txt",
                    position: "top-5 left-10",
                    description: [
                        "A comprehensive School Management System designed to handle complex administrative workflows.",
                        "Built during my tenure as a Full Stack Developer at Genex Software Solutions to streamline operations, records, and daily management tasks.",
                    ],
                },
                {
                    id: 2,
                    name: "github.com",
                    icon: "/images/safari.png",
                    kind: "file",
                    fileType: "url",
                    href: "https://github.com/Bl4ke100/school-management-system",
                    position: "top-10 right-20",
                },
                {
                    id: 4,
                    name: "sms-preview.png",
                    icon: "/images/sms-preview.png",
                    kind: "file",
                    fileType: "img",
                    position: "top-52 right-80",
                    imageUrl: "/images/sms-preview.png",
                },
            ],
        },
    ],
};

const ABOUT_LOCATION = {
    id: 2,
    type: "about",
    name: "About me",
    icon: "/icons/info.svg",
    kind: "folder",
    children: [
        {
            id: 1,
            name: "me.png",
            icon: "/images/me2.png",
            kind: "file",
            fileType: "img",
            position: "top-10 left-5",
            imageUrl: "/images/me2.png",
        },
        {
            id: 2,
            name: "casual-me.png",
            icon: "/images/casual-me.png",
            kind: "file",
            fileType: "img",
            position: "top-28 right-72",
            imageUrl: "/images/casual-me.png",
        },
        {
            id: 4,
            name: "about-me.txt",
            icon: "/images/txt.png",
            kind: "file",
            fileType: "txt",
            position: "top-60 left-5",
            image: "/images/cat-hello.gif",
            description: [
                "Hey, I'm Blake 👋. I'm a Full Stack & Frontend Software Engineer based in Sri Lanka currently wrapping up my Software Engineering degree",
                "I specialize in building scalable web and mobile applications using React, Next.js, and Java.",
                "I’m big on clean UI, good UX, and writing code that doesn’t need a search party to debug.",
                "When I'm not coding, you can usually find me pushing my PC hardware to the limit, modding Cyberpunk 2077 for maximum photorealism, or deep into a story-driven RPG.",
            ],
        },
    ],
};

const RESUME_LOCATION = {
    id: 3,
    type: "resume",
    name: "Resume",
    icon: "/icons/file.svg",
    kind: "folder",
    children: [
        {
            id: 1,
            name: "Resume.pdf",
            icon: "/images/pdf.png",
            kind: "file",
            fileType: "pdf",
            // you can add `href` if you want to open a hosted resume
            // href: "/your/resume/path.pdf",
        },
    ],
};

const MY_RIG_LOCATION = {
    id: 4,
    type: "my-rig",
    name: "My Rig",
    icon: "/icons/rig.svg",
    kind: "folder",
    children: [
        {
            id: 1,
            name: "my-rig-1.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: "/images/my-rig-1.png",
        },
        {
            id: 2,
            name: "my-rig-2.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: "/images/my-rig-2.png",
        },
        {
            id: 3,
            name: "my-rig-3.png",
            icon: "/images/image.png",
            kind: "file",
            fileType: "img",
            imageUrl: "/images/my-rig-3.png",
        },

    ],
};

export const locations = {
    work: WORK_LOCATION,
    about: ABOUT_LOCATION,
    resume: RESUME_LOCATION,
    "my-rig": MY_RIG_LOCATION,
};

const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
    finder: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    contact: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    resume: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    safari: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    photos: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    terminal: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    txtfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    imgfile: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    spotify: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    youtube: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    steam: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
    tiktok: { isOpen: false, zIndex: INITIAL_Z_INDEX, data: null },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };