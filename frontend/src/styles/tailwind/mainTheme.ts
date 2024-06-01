const mainTheme = {
    container: {
        center: true,
        padding: '2rem',
    },
    extend: {
        screens: {
            'tn': '450px',
        },
        colors: {
            primaryLight: '#42a5f5',
            primaryMain: '#1976d2',
            primaryDark: '#1565c0',
        },
        borderStyle: {
            simple: 'solid',
        },
        backgroundImage: {
            primaryGradient: 'linear-gradient(45deg, #42a5f5 0%, #1976d2 100%)',
        },
        shadow: {
            text: "-3px 2px 8px black",
            basic: 'rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em',
            medium: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
        },
        fontSize: {
            base: '16px',
        },
    },
};

export default mainTheme;
