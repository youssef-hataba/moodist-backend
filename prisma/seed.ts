import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding real store data...");

  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.design.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // =========================
  // CATEGORIES
  // =========================
  const tshirts = await prisma.category.create({
    data: {
      name: "T-Shirts",
      slug: "t-shirts",
      description: "Premium cotton t-shirts for everyday wear",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    },
  });

  const pants = await prisma.category.create({
    data: {
      name: "Pants",
      slug: "pants",
      description: "Jeans, cargos and casual pants",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    },
  });

  const hoodies = await prisma.category.create({
    data: {
      name: "Hoodies",
      slug: "hoodies",
      description: "Warm and oversized hoodies",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7",
    },
  });

  // =========================
  // REAL PRODUCTS
  // =========================
  const products = [
  // T-SHIRTS
  {
    title: "Nike Sportswear Club T-Shirt",
    price: 899,
    categoryId: tshirts.id,
    img: "https://res.cloudinary.com/dmohzjxxd/image/upload/v1777670236/moodist-products/1777670236012-shirts.jpg.png",
  },
  {
    title: "Adidas Essentials Tee",
    price: 849,
    categoryId: tshirts.id,
    img: "https://res.cloudinary.com/dmohzjxxd/image/upload/v1777670236/moodist-products/1777670236012-shirts.jpg.png",
  },
  {
    title: "Puma Logo Classic Tee",
    price: 799,
    categoryId: tshirts.id,
    img: "https://res.cloudinary.com/dmohzjxxd/image/upload/v1777670236/moodist-products/1777670236012-shirts.jpg.png",
  },

  // PANTS
  {
    title: "Levi's 511 Slim Fit Jeans",
    price: 2499,
    categoryId: pants.id,
    img: "https://res.cloudinary.com/dmohzjxxd/image/upload/v1777670278/moodist-products/1777670277202-pants.jpg.png",
  },
  {
    title: "Zara Slim Fit Chino Pants",
    price: 1599,
    categoryId: pants.id,
    img: "https://res.cloudinary.com/dmohzjxxd/image/upload/v1777670278/moodist-products/1777670277202-pants.jpg.png",
  },
  {
    title: "H&M Regular Fit Jeans",
    price: 1299,
    categoryId: pants.id,
    img: "https://res.cloudinary.com/dmohzjxxd/image/upload/v1777670278/moodist-products/1777670277202-pants.jpg.png",
  },
  {
    title: "Carhartt WIP Cargo Pants",
    price: 2999,
    categoryId: pants.id,
    img: "https://res.cloudinary.com/dmohzjxxd/image/upload/v1777670278/moodist-products/1777670277202-pants.jpg.png",
  },

  // HOODIES
  {
    title: "Nike Club Fleece Hoodie",
    price: 1899,
    categoryId: hoodies.id,
    img: "https://res.cloudinary.com/dmohzjxxd/image/upload/v1777670195/moodist-products/1777670194680-hoodie.jpg.png",
  },
  {
    title: "Adidas Essentials Hoodie",
    price: 1799,
    categoryId: hoodies.id,
    img: "https://res.cloudinary.com/dmohzjxxd/image/upload/v1777670195/moodist-products/1777670194680-hoodie.jpg.png",
  },
  {
    title: "Zara Oversized Hoodie",
    price: 1499,
    categoryId: hoodies.id,
    img: "https://res.cloudinary.com/dmohzjxxd/image/upload/v1777670195/moodist-products/1777670194680-hoodie.jpg.png",
  },
];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];

    await prisma.product.create({
      data: {
        title: p.title,
        slug: p.title.toLowerCase().replace(/\s+/g, "-"),
        description: `${p.title} - premium quality product`,
        basePrice: p.price,
        categoryId: p.categoryId,

        images: {
          create: [
            {
              url: p.img,
              isPrimary: true,
              alt: p.title,
            },
          ],
        },

        variants: {
          create: [
            { size: "M", color: "Black", stock: 15, price: p.price },
            { size: "L", color: "White", stock: 10, price: p.price },
          ],
        },
      },
    });
  }

  console.log("Real data seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });