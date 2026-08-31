'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  const featuredProperties = [
    {
      id: 1,
      title: 'Luxury Beachfront Villa',
      location: 'Bali, Indonesia',
      price: 299,
      rating: 4.9,
      image: '🏖️',
    },
    {
      id: 2,
      title: 'Mountain Cabin Retreat',
      location: 'Colorado, USA',
      price: 199,
      rating: 4.8,
      image: '🏔️',
    },
    {
      id: 3,
      title: 'Urban Loft in Downtown',
      location: 'New York, USA',
      price: 249,
      rating: 4.7,
      image: '🏙️',
    },
    {
      id: 4,
      title: 'Countryside Farm House',
      location: 'Tuscany, Italy',
      price: 179,
      rating: 4.9,
      image: '🌾',
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20">
        <div className="space-y-6 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Discover Your Perfect Stay
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find and book unique accommodations around the world. Whether you're looking for a 
            cozy apartment, a luxurious villa, or a mountain cabin, StayElite has something for everyone.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Location</label>
              <input
                type="text"
                placeholder="Where are you going?"
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Check In</label>
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Check Out</label>
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
            Search Properties
          </Button>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Featured Properties</h2>
          <p className="text-muted-foreground">Explore our handpicked selection of premium accommodations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer group"
            >
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  {property.image}
                </span>
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-foreground line-clamp-2">{property.title}</h3>
                <p className="text-sm text-muted-foreground">{property.location}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      ${property.price}
                      <span className="text-sm font-normal text-muted-foreground">/night</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-foreground">{property.rating}</span>
                    <span>⭐</span>
                  </div>
                </div>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-center space-y-4">
        <h2 className="text-3xl font-bold text-primary-foreground">Ready to Host?</h2>
        <p className="text-primary-foreground/90 max-w-2xl mx-auto">
          Share your space and start earning. Become a StayElite host today and reach travelers from around the world.
        </p>
        <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
          Become a Host
        </Button>
      </section>
    </div>
  );
}