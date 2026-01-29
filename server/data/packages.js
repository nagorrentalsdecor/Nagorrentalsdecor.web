const packages = [
    {
        name: 'Luxury Wedding Package',
        description: 'Complete hall decoration with flowers, lighting, stage setup, and table settings.',
        price: 5000,
        isFeatured: true,
        images: ['/images/wedding.png']
    },
    {
        name: 'Birthday Party Standard',
        description: 'Balloon arch, backdrop, cake table decor, and mood lighting.',
        price: 1500,
        isFeatured: true,
        images: ['/images/birthday.png']
    },
    {
        name: 'Cooperate Event Setup',
        description: 'Professional stage, PA system integration, branding backdrop, and VIP seating.',
        price: 3500,
        isFeatured: false,
        images: ['/images/corporate.png']
    },
    {
        name: 'Funeral Decor Service',
        description: 'Respectful and elegant setup with tents, chairs, and fresh flowers.',
        price: 2000,
        isFeatured: false,
        images: ['/images/funeral.png']
    }
];
module.exports = packages;
