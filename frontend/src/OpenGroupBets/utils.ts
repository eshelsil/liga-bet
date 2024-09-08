export function generateStandingClasses(config: {amount: number, class: string}[]) {
    const result = {};
    let currentKey = 0;
    config.forEach(({ amount, class: classValue }) => {
        for (let i = 0; i < amount; i++) {
            result[currentKey++] = classValue;
        }
    });

    return result;
}