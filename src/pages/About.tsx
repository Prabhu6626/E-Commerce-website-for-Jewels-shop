import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Heart, Gem } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: Gem,
      title: 'Quality Craftsmanship',
      description: 'Every piece is meticulously crafted by skilled artisans using the finest materials and traditional techniques.'
    },
    {
      icon: Heart,
      title: 'Passion for Beauty',
      description: 'We believe jewelry should tell a story and capture the essence of life\'s most precious moments.'
    },
    {
      icon: Award,
      title: 'Excellence in Service',
      description: 'Our commitment to exceptional customer service ensures a memorable experience from selection to delivery.'
    },
    {
      icon: Users,
      title: 'Family Heritage',
      description: 'Three generations of jewelry expertise, passed down through our family of master craftsmen.'
    }
  ];

  const team = [
    {
      name: 'Sarah Mitchell',
      role: 'Master Jeweler & Founder',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'With over 25 years of experience, Sarah founded LuxeJewels with a vision to create timeless pieces that celebrate life\'s special moments.'
    },
    {
      name: 'David Chen',
      role: 'Head of Design',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'David brings innovative design concepts while respecting traditional jewelry-making techniques, creating pieces that are both modern and timeless.'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Quality Assurance Director',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Maria ensures every piece meets our exacting standards, overseeing quality control from initial design to final inspection.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center bg-gradient-to-r from-luxury-900 to-luxury-800 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=1600)'
          }}
        ></div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center max-w-4xl mx-auto px-4"
        >
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl">
            Crafting timeless elegance since 1995
          </p>
        </motion.div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20"
        >
          <div>
            <h2 className="font-display text-4xl font-bold text-luxury-800 mb-6">
              A Legacy of Excellence
            </h2>
            <div className="space-y-4 text-luxury-600">
              <p>
                Founded in 1995 by master jeweler Sarah Mitchell, LuxeJewels began as a small 
                family workshop with a simple mission: to create extraordinary jewelry that 
                celebrates life's most precious moments.
              </p>
              <p>
                What started as a passion project has grown into a renowned jewelry house, 
                trusted by customers worldwide for our commitment to quality, craftsmanship, 
                and exceptional service.
              </p>
              <p>
                Today, we continue to honor traditional jewelry-making techniques while 
                embracing innovative designs, ensuring each piece tells a unique story 
                and becomes a treasured heirloom for generations to come.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1616428/pexels-photo-1616428.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Jewelry craftsmanship"
              className="rounded-lg shadow-lg"
            />
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-luxury-800 mb-4">
              Our Values
            </h2>
            <p className="text-luxury-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from design and craftsmanship 
              to customer service and community engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-100 rounded-full mb-4">
                  <value.icon className="h-8 w-8 text-gold-600" />
                </div>
                <h3 className="font-semibold text-luxury-800 mb-2">{value.title}</h3>
                <p className="text-luxury-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-luxury-800 mb-4">
              Meet Our Team
            </h2>
            <p className="text-luxury-600 max-w-2xl mx-auto">
              Our talented team of designers, craftsmen, and specialists work together 
              to bring you exceptional jewelry and service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-luxury-800 mb-1">{member.name}</h3>
                <p className="text-gold-600 font-medium mb-3">{member.role}</p>
                <p className="text-luxury-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-luxury-50 rounded-lg p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gold-600 mb-2">25+</div>
              <div className="text-luxury-600">Years of Excellence</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-600 mb-2">10,000+</div>
              <div className="text-luxury-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-600 mb-2">500+</div>
              <div className="text-luxury-600">Unique Designs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold-600 mb-2">50+</div>
              <div className="text-luxury-600">Awards Won</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;