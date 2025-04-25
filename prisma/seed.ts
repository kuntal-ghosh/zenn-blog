const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting to seed the database...');
  
  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.image.deleteMany();
  await prisma.$executeRaw`DELETE FROM "_PostToTag"`;
  await prisma.tag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Existing data cleared');

  // Create 20 users
  console.log('👤 Creating users...');
  const users = [];
  
  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    
    // Create hashed password - all users have password "password123"
    const hashedPassword = await hash('password123', 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email: faker.internet.email({ firstName, lastName }),
        password: hashedPassword,
        image: faker.image.avatar(),
        bio: faker.lorem.paragraph(),
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      },
    });
    
    users.push(user);
    console.log(`👤 Created user: ${user.name} (${user.email})`);
  }
  
  // Create 20 tags
  console.log('🏷️ Creating tags...');
  const tags = [];
  
  const tagNames = [
    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
    'Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#', 'AWS', 'DevOps',
    'Docker', 'Kubernetes', 'Databases', 'Machine Learning', 'Web Development',
    'Mobile Development'
  ];
  
  for (const name of tagNames) {
    const tag = await prisma.tag.create({
      data: { name },
    });
    
    tags.push(tag);
    console.log(`🏷️ Created tag: ${tag.name}`);
  }
  
  // Create 20 posts with random authors and tags
  console.log('📝 Creating posts...');
  const posts = [];
  
  for (let i = 0; i < 20; i++) {
    // Generate a title and slug
    const title = faker.lorem.sentence().replace(/\\.|!|\?/g, '');
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Select a random author
    const author = users[Math.floor(Math.random() * users.length)];
    
    // Generate TipTap JSON content
    const content = {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 1 },
          content: [{ type: 'text', text: faker.lorem.words(3) }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: faker.lorem.paragraph(5) }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Introduction' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: faker.lorem.paragraphs(2) }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Main Content' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: faker.lorem.paragraphs(3) }]
        },
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Conclusion' }]
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: faker.lorem.paragraphs(1) }]
        }
      ]
    };
    
    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        published: faker.datatype.boolean({ probability: 0.8 }),
        authorId: author.id,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      },
    });
    
    // Connect random tags (1-4 tags per post)
    const tagCount = Math.floor(Math.random() * 4) + 1;
    const shuffledTags = [...tags].sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, tagCount);
    
    for (const tag of selectedTags) {
      await prisma.post.update({
        where: { id: post.id },
        data: {
          tags: {
            connect: { id: tag.id },
          },
        },
      });
    }
    
    posts.push(post);
    console.log(`📝 Created post: ${post.title} by ${author.name}`);
  }
  
  // Create 20 comments
  console.log('💬 Creating comments...');
  
  for (let i = 0; i < 20; i++) {
    // Select a random author
    const author = users[Math.floor(Math.random() * users.length)];
    
    // Select a random post
    const post = posts[Math.floor(Math.random() * posts.length)];
    
    const comment = await prisma.comment.create({
      data: {
        content: faker.lorem.paragraph(),
        authorId: author.id,
        postId: post.id,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      },
    });
    
    console.log(`💬 Created comment for post: ${post.title}`);
  }
  
  // Create 20 images
  console.log('🖼️ Creating images...');
  
  for (let i = 0; i < 20; i++) {
    // Select a random user
    const user = users[Math.floor(Math.random() * users.length)];
    
    const width = faker.number.int({ min: 800, max: 1920 });
    const height = faker.number.int({ min: 600, max: 1080 });
    
    const image = await prisma.image.create({
      data: {
        url: faker.image.url({ width, height }),
        thumbnailUrl: faker.image.url({ width: 150, height: 150 }),
        alt: faker.lorem.words(3),
        width,
        height,
        size: faker.number.int({ min: 50000, max: 5000000 }),
        mimeType: 'image/jpeg',
        userId: user.id,
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      },
    });
    
    console.log(`🖼️ Created image: ${image.url}`);
  }
  
  console.log('✅ Seed completed successfully!');
  console.log('🔑 All users have the password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });