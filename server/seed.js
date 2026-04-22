require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Event = require('./models/Event');
const Booking = require('./models/Booking');

const users = [
    { name: 'Admin User', email: 'admin@eventora.com', password: 'password123', role: 'admin' },
    { name: 'Demo User', email: 'user@eventora.com', password: 'password123', role: 'user' },
    { name: 'Alice Smith', email: 'alice@eventora.com', password: 'password123', role: 'user' },
    { name: 'Bob Johnson', email: 'bob@eventora.com', password: 'password123', role: 'user' },
    { name: 'Charlie Dave', email: 'charlie@eventora.com', password: 'password123', role: 'user' },
    { name: 'Diana Prince', email: 'diana@eventora.com', password: 'password123', role: 'user' },
    { name: 'Ethan Hunt', email: 'ethan@eventora.com', password: 'password123', role: 'user' },
    { name: 'Fiona Gallagher', email: 'fiona@eventora.com', password: 'password123', role: 'user' },
    { name: 'George Miller', email: 'george@eventora.com', password: 'password123', role: 'user' },
    { name: 'Hannah Montana', email: 'hannah@eventora.com', password: 'password123', role: 'user' }
];

const events = [
    {
        title: 'React & Node.js Developer Retreat',
        description: '3-day deep dive into modern full-stack development.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        location: 'Silicon Valley Innovation Center, CA',
        category: 'Technology',
        totalSeats: 200,
        ticketPrice: 0,
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87'
    },
   
    {
        title: 'Neon Nights EDM Festival',
        description: 'EDM, techno, and insane light shows.',
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        location: 'New York',
        category: 'Music',
        totalSeats: 500,
        ticketPrice: 1500,
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819'
    },
    {
        title: 'Business Leaders Summit',
        description: 'CEOs & founders discussing AI and business.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        location: 'London',
        category: 'Business',
        totalSeats: 150,
        ticketPrice: 5000,
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7'
    }
];

const seedDatabase = async () => {
    try {
        const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

        if (!uri) {
            throw new Error('MongoDB connection string is missing in .env');
        }

        console.log(uri);

        await mongoose.connect(uri);

        const salt = await bcrypt.genSalt(10);

        const hashedUsers = users.map(user => ({
            ...user,
            password: bcrypt.hashSync(user.password, salt),
            isVerified: true
        }));

        await User.deleteMany();
        await Event.deleteMany();
        await Booking.deleteMany();

        const createdUsers = await User.insertMany(hashedUsers);

        const admin = createdUsers.find(u => u.role === 'admin');
        const normalUsers = createdUsers.filter(u => u.role === 'user');

        const eventsWithAdmin = events.map(event => ({
            ...event,
            availableSeats: event.totalSeats,
            createdBy: admin._id
        }));

        const createdEvents = await Event.insertMany(eventsWithAdmin);

        const bookings = [];

        for (const event of createdEvents) {
            const randomUsers = [...normalUsers]
                .sort(() => 0.5 - Math.random())
                .slice(0, Math.floor(Math.random() * 4) + 3);

            for (const user of randomUsers) {
                const statuses = ['pending', 'confirmed', 'cancelled'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                let paymentStatus = 'not_paid';

                if (event.ticketPrice === 0) {
                    paymentStatus = 'paid';
                } else if (status === 'confirmed') {
                    paymentStatus = Math.random() > 0.1 ? 'paid' : 'not_paid';
                }

                bookings.push({
                    userId: user._id,
                    eventId: event._id,
                    status,
                    paymentStatus,
                    amount: event.ticketPrice
                });

                if (status === 'confirmed') {
                    event.availableSeats -= 1;
                    await event.save();
                }
            }
        }

        await Booking.insertMany(bookings);

        console.log('Database seeded successfully');

        process.exit(0);

    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

seedDatabase();