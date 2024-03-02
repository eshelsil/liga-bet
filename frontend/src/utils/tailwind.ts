import mainTheme from '@/styles/tailwind/mainTheme';
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { keysOf } from './common';


const fontSize = mainTheme.extend.fontSize;
const fontSizeAdditionalValues = keysOf(fontSize);
type FontSizeValue = keyof typeof fontSize;
type AdditionalFontSizeClassGroupIds = `text-${FontSizeValue}`;
const fontSizeAdditionalClasses: AdditionalFontSizeClassGroupIds[] = [];
fontSizeAdditionalValues.forEach((v) => fontSizeAdditionalClasses.push(`text-${v}`));

type AdditionalClassGroupIds = AdditionalFontSizeClassGroupIds;

const customTwMerge = extendTailwindMerge<AdditionalClassGroupIds>({
    extend: {
        classGroups: {
            'font-size': fontSizeAdditionalClasses,
        },
    },
});

export function cn(...inputs: ClassValue[]) {
    return customTwMerge(clsx(inputs));
}
