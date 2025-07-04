import { Product } from '../types';

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Elegant Diamond Necklace',
    description: 'A stunning diamond necklace crafted with 18k white gold and featuring brilliant-cut diamonds. Perfect for special occasions.',
    price: 2499,
    originalPrice: 2999,
    category: 'Necklaces',
    images: [
      'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1616428/pexels-photo-1616428.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    preOrder: false,
    materials: ['18k White Gold', 'Diamond'],
    sizes: ['16 inches', '18 inches', '20 inches'],
    rating: 4.8,
    reviewCount: 24,
    tags: ['luxury', 'diamond', 'wedding'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Rose Gold Bracelet',
    description: 'Delicate rose gold bracelet with intricate chain design. A perfect everyday accessory that adds elegance to any outfit.',
    price: 899,
    category: 'Bracelets',
    images: [
      'https://images.pexels.com/photos/1616428/pexels-photo-1616428.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: false,
    preOrder: true,
    estimatedDispatch: '2024-03-15',
    materials: ['18k Rose Gold'],
    sizes: ['6.5 inches', '7 inches', '7.5 inches'],
    rating: 4.6,
    reviewCount: 18,
    tags: ['rose-gold', 'delicate', 'everyday'],
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Pearl Drop Earrings',
    description: 'Classic pearl drop earrings with sterling silver posts. Timeless elegance that complements both casual and formal attire.',
    price: 399,
    category: 'Earrings',
    images: [
      'https://images.pexels.com/photos/1616428/pexels-photo-1616428.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    preOrder: false,
    materials: ['Sterling Silver', 'Fresh Water Pearl'],
    colors: ['White', 'Cream'],
    rating: 4.7,
    reviewCount: 31,
    tags: ['pearl', 'classic', 'formal'],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
  {
    id: '4',
    name: 'Sapphire Engagement Ring',
    description: 'Exquisite sapphire engagement ring set in platinum with diamond accents. A symbol of eternal love and commitment.',
    price: 3999,
    originalPrice: 4499,
    category: 'Rings',
    images: [
      'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    preOrder: false,
    materials: ['Platinum', 'Sapphire', 'Diamond'],
    sizes: ['5', '5.5', '6', '6.5', '7', '7.5', '8'],
    rating: 4.9,
    reviewCount: 12,
    tags: ['engagement', 'sapphire', 'luxury'],
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
  },
  {
    id: '5',
    name: 'Gold Chain Watch',
    description: 'Vintage-inspired gold chain watch with Roman numerals. Perfect blend of classic design and modern functionality.',
    price: 1299,
    category: 'Watches',
    images: [
      'https://images.pexels.com/photos/1616428/pexels-photo-1616428.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: true,
    preOrder: false,
    materials: ['14k Yellow Gold', 'Stainless Steel'],
    rating: 4.5,
    reviewCount: 28,
    tags: ['vintage', 'watch', 'gold'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: '6',
    name: 'Bridal Jewelry Set',
    description: 'Complete bridal set including necklace, earrings, and bracelet. Crafted with crystals and pearls for your special day.',
    price: 1899,
    originalPrice: 2299,
    category: 'Sets',
    images: [
      'https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    inStock: false,
    preOrder: true,
    estimatedDispatch: '2024-04-01',
    materials: ['Sterling Silver', 'Crystal', 'Pearl'],
    rating: 4.8,
    reviewCount: 15,
    tags: ['bridal', 'set', 'wedding'],
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z',
  }
];

export const mockTestimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'Absolutely stunning jewelry! The quality exceeded my expectations and the customer service was exceptional.',
    product: 'Diamond Necklace'
  },
  {
    id: '2',
    name: 'Emily Davis',
    image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'I ordered a custom piece and it was perfect! The attention to detail is remarkable.',
    product: 'Custom Ring'
  },
  {
    id: '3',
    name: 'Jessica Wilson',
    image: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'Fast shipping and beautiful packaging. The rose gold bracelet is exactly what I wanted!',
    product: 'Rose Gold Bracelet'
  }
];