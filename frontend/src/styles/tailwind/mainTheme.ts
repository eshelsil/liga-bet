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
        backgroundImage: {
            primaryGradient: 'linear-gradient(45deg, #42a5f5 0%, #1976d2 100%)',
        },
        shadow: {
            text: "-3px 2px 8px black"
        },
        fontSize: {
            base: '16px',
        },
    },
};

export default mainTheme;
