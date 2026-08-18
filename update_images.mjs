import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SERVICE_IMAGES = {
  veneers: 'https://images.pexels.com/photos/6627571/pexels-photo-6627571.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  crowns: 'https://images.pexels.com/photos/6627279/pexels-photo-6627279.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  whitening: 'https://images.pexels.com/photos/6627575/pexels-photo-6627575.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  implants: 'https://images.pexels.com/photos/6502343/pexels-photo-6502343.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  orthodontics: 'https://images.pexels.com/photos/28407749/pexels-photo-28407749.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  rootCanal: 'https://images.pexels.com/photos/4270374/pexels-photo-4270374.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  trauma: 'https://images.pexels.com/photos/16556187/pexels-photo-16556187.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  gums: 'https://images.pexels.com/photos/6627535/pexels-photo-6627535.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  
  dentures: 'https://images.pexels.com/photos/3845981/pexels-photo-3845981.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  extraction: 'https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  fillings: 'https://images.pexels.com/photos/6809658/pexels-photo-6809658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  childrens: 'https://images.pexels.com/photos/3845806/pexels-photo-3845806.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  xray: 'https://images.pexels.com/photos/16556187/pexels-photo-16556187.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200'
};

const imageMap = {
  'dental-veneers': SERVICE_IMAGES.veneers,
  'dental-crowns': SERVICE_IMAGES.crowns,
  'teeth-whitening': SERVICE_IMAGES.whitening,
  'dental-implants': SERVICE_IMAGES.implants,
  'braces-orthodontics': SERVICE_IMAGES.orthodontics,
  'root-canal-treatment': SERVICE_IMAGES.rootCanal,
  'facial-trauma-care': SERVICE_IMAGES.trauma,
  'gum-treatment': SERVICE_IMAGES.gums,
  'dentures-prosthodontics': SERVICE_IMAGES.dentures,
  'tooth-extraction': SERVICE_IMAGES.extraction,
  'dental-fillings': SERVICE_IMAGES.fillings,
  'childrens-dentistry': SERVICE_IMAGES.childrens,
  'dental-xray-diagnostics': SERVICE_IMAGES.xray,
};

async function main() {
  const services = await prisma.service.findMany();
  for (const s of services) {
    if (imageMap[s.slug]) {
      await prisma.service.update({
        where: { id: s.id },
        data: { image: imageMap[s.slug] }
      });
      console.log(`Updated image for ${s.slug}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
