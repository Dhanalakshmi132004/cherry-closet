import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.variant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Database cleared.');

  // Create Users
  const customerPasswordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('password123', 10);

  const customer = await prisma.user.create({
    data: {
      email: 'customer@crochet.com',
      name: 'Sarah Jenkins',
      passwordHash: customerPasswordHash,
      role: 'customer',
      addresses: {
        create: {
          line1: '123 Meadow Lane',
          line2: 'Apt 4B',
          city: 'Portland',
          state: 'OR',
          postalCode: '97201',
          country: 'United States',
        },
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@crochet.com',
      name: 'Elena Rostova (Shop Owner)',
      passwordHash: adminPasswordHash,
      role: 'admin',
    },
  });

  console.log('Created Users:', {
    customer: customer.email,
    admin: admin.email,
  });

  // Create Collections
  const clothingColl = await prisma.collection.create({
    data: { name: 'Clothing', slug: 'clothing' },
  });
  const accessoriesColl = await prisma.collection.create({
    data: { name: 'Accessories', slug: 'accessories' },
  });
  const homeColl = await prisma.collection.create({
    data: { name: 'Home & Living', slug: 'home-and-living' },
  });
  const amigurumiColl = await prisma.collection.create({
    data: { name: 'Amigurumi', slug: 'amigurumi' },
  });

  console.log('Created Collections');

  const productsData = [
    {
      title: 'Cozy Terracotta Cardigan',
      slug: 'cozy-terracotta-cardigan',
      description: 'A chunky, oversized cardigan handcrafted from a premium blend of organic cotton and merino wool. Featuring a relaxed drop-shoulder design, balloon sleeves, and custom wooden buttons. Perfect for layering on chilly autumn days. Highly breathable, soft against the skin, and built to last.',
      materials: '80% Organic Cotton, 20% Merino Wool',
      basePrice: 120.0,
      compareAtPrice: 145.0,
      madeToOrder: true,
      shipEstimateDays: 14,
      collectionId: clothingColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Terracotta Cardigan model view' },
        { url: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?auto=format&fit=crop&w=800&q=80', position: 1, altText: 'Close up of wooden buttons and stitches' }
      ],
      variants: [
        { color: 'Terracotta', size: 'S/M', stock: 5, sku: 'CARD-TER-SM' },
        { color: 'Terracotta', size: 'L/XL', stock: 3, sku: 'CARD-TER-LXL' },
        { color: 'Oatmeal', size: 'S/M', stock: 4, sku: 'CARD-OAT-SM', priceOverride: 125.0 },
        { color: 'Oatmeal', size: 'L/XL', stock: 2, sku: 'CARD-OAT-LXL', priceOverride: 125.0 }
      ]
    },
    {
      title: 'Sage Meadow Tote Bag',
      slug: 'sage-meadow-tote-bag',
      description: 'An elegant and sturdy market bag crafted with dense granny-square stitchwork. Reinforced straps ensure comfort even when carrying heavy items. Fully lined with matching organic canvas to keep small items secure.',
      materials: '100% Recycled Cotton Yarn, Canvas Lining',
      basePrice: 48.0,
      compareAtPrice: null,
      madeToOrder: false,
      shipEstimateDays: 2,
      collectionId: accessoriesColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Sage Meadow Tote Bag hanging' }
      ],
      variants: [
        { color: 'Sage Green', size: 'Standard', stock: 8, sku: 'TOTE-SAGE-STD' },
        { color: 'Natural Cream', size: 'Standard', stock: 12, sku: 'TOTE-CREM-STD' }
      ]
    },
    {
      title: 'Lavender Dreams Slouchy Beanie',
      slug: 'lavender-dreams-beanie',
      description: 'An ultra-soft, ribbed knit beanie with a generous slouch. Crafted with pure alpaca wool for unparalleled warmth and a lightweight feel. Features a fold-over cuff to adjust fit.',
      materials: '100% Baby Alpaca Wool',
      basePrice: 35.0,
      compareAtPrice: 42.0,
      madeToOrder: false,
      shipEstimateDays: 1,
      collectionId: accessoriesColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Lavender Slouchy Beanie' }
      ],
      variants: [
        { color: 'Lavender', size: 'One Size', stock: 15, sku: 'BEAN-LAV-OS' },
        { color: 'Mustard Gold', size: 'One Size', stock: 0, sku: 'BEAN-GOLD-OS' } // out of stock
      ]
    },
    {
      title: 'Peach Blossom Coasters (4-Pack)',
      slug: 'peach-blossom-coasters',
      description: 'A set of four delicate flower-shaped coasters, crocheted using thick absorbable cotton yarn. Adds a sweet, cottagecore aesthetic to your coffee table while protecting surfaces.',
      materials: '100% Combed Cotton Yarn',
      basePrice: 18.0,
      compareAtPrice: null,
      madeToOrder: true,
      shipEstimateDays: 5,
      collectionId: homeColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Flower coasters next to a tea cup' }
      ],
      variants: [
        { color: 'Peach & Cream Mixed', size: 'Set of 4', stock: 20, sku: 'COAS-PEACH-SET' }
      ]
    },
    {
      title: 'Forest Sprite Plushie (Amigurumi)',
      slug: 'forest-sprite-plushie',
      description: 'Meet Pippin, the forest sprite amigurumi. Handmade with love and premium blanket yarn, making him incredibly soft and huggable. Features safety eyes and embroidered details. Perfect gift for kids and whimsical collectors.',
      materials: '100% Polyester Chenille Yarn, Hypoallergenic Fiberfill, Safety Eyes',
      basePrice: 28.0,
      compareAtPrice: 32.0,
      madeToOrder: true,
      shipEstimateDays: 7,
      collectionId: amigurumiColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Green Forest Sprite Plushie sitting on shelf' }
      ],
      variants: [
        { color: 'Mint Green', size: '7 inches', stock: 4, sku: 'AMI-SPRI-MNT' },
        { color: 'Forest Green', size: '7 inches', stock: 2, sku: 'AMI-SPRI-FRST' }
      ]
    },
    {
      title: 'Mustard Chunky Throw Blanket',
      slug: 'mustard-chunky-throw-blanket',
      description: 'Make a bold statement with this super-chunky hand-crocheted throw blanket. Made with thick, high-loft yarn, this blanket weighs over 5 pounds and provides a weight of comfort that feels like a warm hug.',
      materials: '100% Premium Thick Acrylic Yarn',
      basePrice: 150.0,
      compareAtPrice: null,
      madeToOrder: true,
      shipEstimateDays: 21,
      collectionId: homeColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Chunky yellow throw blanket folded on sofa' }
      ],
      variants: [
        { color: 'Mustard Yellow', size: '50" x 60"', stock: 3, sku: 'BLAN-CHUN-MST' }
      ]
    },
    {
      title: 'Daisy Chain Hairband',
      slug: 'daisy-chain-hairband',
      description: 'A charming retro-inspired headband featuring delicate crocheted daisies connected by a comfortable sage green base. Features tie-back straps to adjust to any head size.',
      materials: '100% Mercerized Cotton Yarn',
      basePrice: 15.0,
      compareAtPrice: null,
      madeToOrder: false,
      shipEstimateDays: 2,
      collectionId: accessoriesColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Daisy chain hair accessory' }
      ],
      variants: [
        { color: 'Classic White & Yellow', size: 'One Size', stock: 25, sku: 'HAIR-DAIS-OS' }
      ]
    },
    {
      title: 'Honeycomb Cropped Vest',
      slug: 'honeycomb-cropped-vest',
      description: 'A beautifully structured cropped vest featuring an intricate honeycomb stitch pattern. With deep ribbing around the waist and armholes, it is a versatile layering piece for tees and collared shirts.',
      materials: '50% Merino Wool, 50% Bamboo Silk',
      basePrice: 75.0,
      compareAtPrice: 90.0,
      madeToOrder: true,
      shipEstimateDays: 10,
      collectionId: clothingColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1584992791193-5db3cb340f4e?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Yarn work showing fine knit patterns' }
      ],
      variants: [
        { color: 'Honey Gold', size: 'S', stock: 3, sku: 'VEST-HON-S' },
        { color: 'Honey Gold', size: 'M', stock: 2, sku: 'VEST-HON-M' },
        { color: 'Honey Gold', size: 'L', stock: 2, sku: 'VEST-HON-L' }
      ]
    },
    {
      title: 'Oatmeal Slouchy Boot Socks',
      slug: 'oatmeal-slouchy-socks',
      description: 'Keep your toes cozy in these thick, breathable lounge socks. Designed with a loose elastic rib at the ankle for a relaxed slouch look. Perfect for wearing around the house or peeking out of boots.',
      materials: '75% Wool, 20% Nylon, 5% Spandex (for stretch)',
      basePrice: 24.0,
      compareAtPrice: null,
      madeToOrder: false,
      shipEstimateDays: 3,
      collectionId: clothingColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Cosy socks on feet resting by fire' }
      ],
      variants: [
        { color: 'Oatmeal', size: 'M (6-8)', stock: 10, sku: 'SOCK-OAT-M' },
        { color: 'Oatmeal', size: 'L (9-11)', stock: 8, sku: 'SOCK-OAT-L' }
      ]
    },
    {
      title: 'Crimson Rose Book Sleeve',
      slug: 'crimson-rose-book-sleeve',
      description: 'Protect your favorite reads in style. This book sleeve features a gorgeous textured rose motif on the front and a loop-and-button closure to keep books securely tucked away.',
      materials: '100% Cotton Yarn, Vintage Wood Button',
      basePrice: 22.0,
      compareAtPrice: 26.0,
      madeToOrder: false,
      shipEstimateDays: 2,
      collectionId: accessoriesColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Book mockup illustrating sleeve use case' }
      ],
      variants: [
        { color: 'Crimson Red', size: 'Standard (Paperback)', stock: 6, sku: 'SLVE-ROSE-PB' },
        { color: 'Crimson Red', size: 'Large (Hardcover)', stock: 4, sku: 'SLVE-ROSE-HC', priceOverride: 26.0 }
      ]
    },
    {
      title: 'Ocean Waves Baby Blanket',
      slug: 'ocean-waves-baby-blanket',
      description: 'An incredibly soft, ripple-stitch baby blanket in soothing shades of teal, seafoam, and cream. Gentle on sensitive skin and machine washable for easy care. The ideal baby shower gift.',
      materials: '100% Organic Bamboo-Cotton Blend Yarn',
      basePrice: 65.0,
      compareAtPrice: null,
      madeToOrder: true,
      shipEstimateDays: 8,
      collectionId: homeColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Soft baby blanket draped over crib' }
      ],
      variants: [
        { color: 'Ocean Ripple', size: '30" x 36"', stock: 5, sku: 'BLAN-BABY-OCN' }
      ]
    },
    {
      title: 'Baby Dino Amigurumi',
      slug: 'baby-dino-amigurumi',
      description: 'A tiny, cute triceratops plushie. Fits in the palm of your hand! Crocheted with super-tight stitch tension to prevent fiberfill from peeking through. Safety eyes are melt-backed for extra durability.',
      materials: '100% Combed Cotton, Polyester Stuffing, Safety Eyes',
      basePrice: 20.0,
      compareAtPrice: null,
      madeToOrder: false,
      shipEstimateDays: 2,
      collectionId: amigurumiColl.id,
      published: true,
      images: [
        { url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80', position: 0, altText: 'Cute stuffed toys in nursery room' }
      ],
      variants: [
        { color: 'Sage & Mustard', size: 'Mini (4 inches)', stock: 12, sku: 'AMI-DINO-MIN' }
      ]
    }
  ];

  console.log('Seeding products...');
  for (const prod of productsData) {
    const { images, variants, ...prodFields } = prod;
    
    const createdProduct = await prisma.product.create({
      data: {
        ...prodFields,
        images: {
          create: images
        },
        variants: {
          create: variants
        }
      }
    });
    console.log(`- Created product: ${createdProduct.title}`);
  }

  // Create Some Sample Orders
  console.log('Creating sample orders...');
  const order1 = await prisma.order.create({
    data: {
      userId: customer.id,
      status: 'pending',
      subtotal: 153.0,
      shippingCost: 8.0,
      total: 161.0,
      addressId: (await prisma.address.findFirst({ where: { userId: customer.id } }))?.id,
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst({ where: { slug: 'sage-meadow-tote-bag' } }))?.id,
            variantId: (await prisma.variant.findFirst({ where: { sku: 'TOTE-SAGE-STD' } }))?.id,
            quantity: 1,
            priceAtPurchase: 48.0,
          },
          {
            productId: (await prisma.product.findFirst({ where: { slug: 'cozy-terracotta-cardigan' } }))?.id,
            variantId: (await prisma.variant.findFirst({ where: { sku: 'CARD-OAT-SM' } }))?.id,
            quantity: 1,
            priceAtPurchase: 105.0, // base 120, oatmeal premium +5 = 125, let's just make it realistic
          }
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      status: 'shipped',
      subtotal: 35.0,
      shippingCost: 5.0,
      total: 40.0,
      customerEmail: 'guest_buyer@example.com',
      customerName: 'Marcus Aurelius',
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst({ where: { slug: 'lavender-dreams-beanie' } }))?.id,
            variantId: (await prisma.variant.findFirst({ where: { sku: 'BEAN-LAV-OS' } }))?.id,
            quantity: 1,
            priceAtPurchase: 35.0,
          }
        ]
      }
    }
  });

  console.log('Seeded sample orders:', [order1.id, order2.id]);
  console.log('Seeding database completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
