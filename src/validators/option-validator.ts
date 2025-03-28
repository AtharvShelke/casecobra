// bg-blue-950 border-blue-950
// bg-zinc-900 border-zinc-900
// bg-rose-950 border-rose-950

import { PRODUCT_PRICES } from "@/config/products"


export const COLORS = [
    {
        label: "Black",
        value: 'black',
        tw: 'zinc-900'
    },
    {
        label: "Blue",
        value: 'blue',
        tw: 'blue-950'
    },
    {
        label: "Rose",
        value: 'rose',
        tw: 'rose-950'
    },
] as const

export const MODELS = {
    name: 'models',
    options: [
        {
            label: 'iPhone 11',
            value: 'iPhone11'
        },
        {
            label: 'iPhone 12',
            value: 'iPhone12'
        },
        {
            label: 'iPhone 13',
            value: 'iPhone13'
        },
        {
            label: 'iPhone 14',
            value: 'iPhone14'
        },
        {
            label: 'iPhone 15',
            value: 'iPhone15'
        },
        {
            label: 'iPhone 16',
            value: 'iPhone16'
        },
    ]
} as const

export const MATERIALS = {
    name:'materials',
    options:[
        {
            label:'Silicone',
            value:'silicone',
            description:'',
            price:PRODUCT_PRICES.material.silicone,
        },
        {
            label:'Soft Polycarbonate',
            value:'polycarbonate',
            description:"Scratch-resistant coating",
            price:PRODUCT_PRICES.material.polycarbonate,
        },
    ]
} as const

export const FINISHES = {
    name:'finishes',
    options:[
        {
            label:'Smooth Finish',
            value:'smooth',
            description:'',
            price:PRODUCT_PRICES.finish.smooth,
        },
        {
            label:'Textured Finish',
            value:'textured',
            description:"Soft grippy texture",
            price:PRODUCT_PRICES.finish.textured,
        },
    ]
} as const