import { Product } from '@/src/types';

// New Pricing Logic: 
// 10% Markup for < 10,000
// 7% Markup for >= 10,000
// Ends in 9
export const calculateFinalPrice = (basePrice: number): number => {
    let rate = 0.10;
    if (basePrice >= 10000) {
        rate = 0.07;
    }
    const withMarkup = basePrice * (1 + rate);
    // Logic: Floor to nearest 10, then add 9. (e.g., 5500 -> 5509, 5504 -> 5509)
    return Math.floor(withMarkup / 10) * 10 + 9;
};

// Helper to generate consistent, high-quality AI product images on the fly
const getImg = (id: string, category: string, name: string) => {
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const prompt = `professional product photography of ${name}, ${category}, white background, soft studio lighting, modern furniture design, high resolution, 4k, minimalistic`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&nologo=true&seed=${seed}`;
};

export const PRODUCTS_DB: Product[] = [
  {
    "id": "944EOT",
    "sku": "944EOT",
    "name": "EXECUTIVE GLASS TOP TABLE",
    "description": "Premium executive desk featuring a sleek tempered glass counter-top and a modern steel frame front panel. Includes a mobile pedestal for personal storage and a side extension table with a melamine cabinet. The stainless steel leg frame ensures durability and a sophisticated aesthetic perfect for CEO offices.",
    "dimensions": "Standard Size",
    "price": 25800.00,
    "category": "Executive Table",
    "image": getImg("944EOT", "Executive Table", "EXECUTIVE GLASS TOP TABLE"),
    "stock": 10
  },
  {
    "id": "NKT-0311",
    "sku": "NKT-0311",
    "name": "EXECUTIVE GLASS TOP TABLE",
    "description": "Spacious executive desk with a high-quality glass top finish. Designed for professionals who need a large workspace with a modern touch. Features robust construction and elegant lines. Available in 1.6m and 1.8m sizes.",
    "dimensions": "Varies by Selection",
    "price": 20583.33,
    "category": "Executive Table",
    "image": getImg("NKT-0311", "Executive Table", "EXECUTIVE GLASS TOP TABLE"),
    "stock": 10,
    "variants": [
      {
        "name": "Size",
        "options": ["1.6m (L160cm x W70cm)", "1.8m (L180cm x W80cm)"],
        "prices": {
          "1.6m (L160cm x W70cm)": 20583.33,
          "1.8m (L180cm x W80cm)": 24700.00
        }
      }
    ]
  },
  {
    "id": "NKT-0031",
    "sku": "NKT-0031",
    "name": "EXECUTIVE TABLE",
    "description": "Sophisticated executive table featuring a 12mm thick tempered glass counter-top and melamine legs. Includes a melamine front panel for privacy, a mobile pedestal for secure storage, and a side extension table. Perfect for a commanding office presence.",
    "dimensions": "Varies by Selection",
    "price": 21135.00,
    "category": "Executive Table",
    "image": getImg("NKT-0031", "Executive Table", "EXECUTIVE TABLE"),
    "stock": 10,
    "variants": [
      {
        "name": "Size",
        "options": ["1.6m (L160cm x W80cm)", "1.8m (L180cm x W80cm)"],
        "prices": {
           "1.6m (L160cm x W80cm)": 21135.00,
           "1.8m (L180cm x W80cm)": 21850.00
        }
      }
    ]
  },
  {
    "id": "JAA-EXECUTIVE",
    "sku": "JAA-EXECUTIVE",
    "name": "EXECUTIVE L-TYPE TABLE (JAA Series)",
    "description": "Massive L-shaped executive desk designed for ultimate productivity. Features a wide legroom, soft-close drawers, push-to-open cabinets, and a secure combi-lock system. Built-in grommets ensure a clutter-free workspace.",
    "dimensions": "Varies by Selection",
    "price": 24685.00,
    "category": "Executive Table",
    "image": getImg("JAA-EXECUTIVE", "Executive Table", "EXECUTIVE L-TYPE TABLE"),
    "stock": 10,
    "variants": [
       {
         "name": "Size",
         "options": ["1.8m (L180cm x W80cm)", "2.0m (L200cm x W80cm)"],
         "prices": {
            "1.8m (L180cm x W80cm)": 24685.00,
            "2.0m (L200cm x W80cm)": 25200.00
         }
       }
    ]
  },
  {
    "id": "SH102",
    "sku": "SH102",
    "name": "EXECUTIVE L-TYPE TABLE (NKT Series)",
    "description": "Versatile L-shaped desk with variable length options. Features a push-to-open side cabinet and smooth-gliding drawers. The integrated combi-lock system and cable grommets make it a practical choice for modern managers.",
    "dimensions": "Varies by Selection",
    "price": 18515.00,
    "category": "Executive Table",
    "image": getImg("SH102", "Executive Table", "EXECUTIVE L-TYPE TABLE"),
    "stock": 10,
    "variants": [
      {
        "name": "Size",
        "options": ["1.6m (L160cm x W72cm)", "1.8m (L180cm x W72cm)"],
        "prices": {
          "1.6m (L160cm x W72cm)": 18515.00,
          "1.8m (L180cm x W72cm)": 19715.00
        }
      }
    ]
  },
  {
    "id": "16051",
    "sku": "16051",
    "name": "EXECUTIVE L-TYPE TABLE",
    "description": "Classic melamine finished executive desk with a side return. Features a dedicated system unit bin, shelves, and a combi-lock drawer for security. Cable grommets help maintain a tidy work surface.",
    "dimensions": "Varies by Selection",
    "price": 15000.00,
    "category": "Executive Table",
    "image": getImg("16051", "Executive Table", "EXECUTIVE L-TYPE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.6m (L160cm x W80cm)", "1.8m (L180cm x W80cm)"],
            "prices": {
                "1.6m (L160cm x W80cm)": 15000.00,
                "1.8m (L180cm x W80cm)": 16250.00
            }
        }
    ]
  },
  {
    "id": "103",
    "sku": "103",
    "name": "EXECUTIVE L-TYPE TABLE",
    "description": "Functional L-shaped desk with a clean melamine finish. Includes a side rack with a system unit bin, open shelves, and a secure combi-lock drawer. Perfect for organized workstations.",
    "dimensions": "Varies by Selection",
    "price": 14600.00,
    "category": "Executive Table",
    "image": getImg("103", "Executive Table", "EXECUTIVE L-TYPE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.6m (L160cm x W80cm)", "1.8m (L180cm x W80cm)"],
            "prices": {
                "1.6m (L160cm x W80cm)": 14600.00,
                "1.8m (L180cm x W80cm)": 16630.00
            }
        }
    ]
  },
  {
    "id": "SQ-17",
    "sku": "SQ-17",
    "name": "EXECUTIVE L-TYPE TABLE (SQ Series)",
    "description": "Premium L-type desk with a sleek design. Equipped with a system unit bin, secure side drawers, close-in cabinets, and cable management grommets. The side drawer unit offers substantial storage capacity.",
    "dimensions": "Varies by Selection",
    "price": 17000.00,
    "category": "Executive Table",
    "image": getImg("SQ-17", "Executive Table", "EXECUTIVE L-TYPE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Configuration",
            "options": ["1.6m (SQ-1781)", "1.8m (SQ-1781)", "1.8m (SQ-1716)", "2.0m (SQ-1716)"],
            "prices": {
                "1.6m (SQ-1781)": 17000.00,
                "1.8m (SQ-1781)": 18200.00,
                "1.8m (SQ-1716)": 23400.00,
                "2.0m (SQ-1716)": 24500.00
            }
        }
    ]
  },
  {
    "id": "NKT-008",
    "sku": "NKT-008",
    "name": "EXECUTIVE L-TYPE TABLE",
    "description": "Stylish L-type desk available in Brown Wengue or Mahogany finishes. Includes a side drawer unit with shelves and a combi-lock drawer. The melamine finish ensures resistance to scratches and stains.",
    "dimensions": "Varies by Selection",
    "price": 15500.00,
    "category": "Executive Table",
    "image": getImg("NKT-008", "Executive Table", "EXECUTIVE L-TYPE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.6m (L160cm x W80cm)", "1.8m (L180cm x W80cm)", "2.0m (L200cm x W80cm)"],
            "prices": {
                "1.6m (L160cm x W80cm)": 15500.00,
                "1.8m (L180cm x W80cm)": 16785.00,
                "2.0m (L200cm x W80cm)": 17000.00
            }
        }
    ]
  },
  {
    "id": "SQ-6116",
    "sku": "SQ-6116",
    "name": "EXECUTIVE TABLE",
    "description": "Comprehensive 1.6m executive workstation. Includes a mobile pedestal, keyboard tray, close-in side cabinet, and cable grommets. The melamine finish provides a durable and professional surface.",
    "dimensions": "L160cm x W80cm x H76cm",
    "price": 16750.00,
    "category": "Executive Table",
    "image": getImg("SQ-6116", "Executive Table", "EXECUTIVE TABLE"),
    "stock": 10
  },
  {
    "id": "NKT-012",
    "sku": "NKT-012",
    "name": "EXECUTIVE TABLE",
    "description": "Executive desk designed for full functionality. Features a mobile pedestal, dedicated CPU bin, ample drawers, and a close-in cabinet. Keeps all office essentials organized and within reach.",
    "dimensions": "Varies by Selection",
    "price": 18600.00,
    "category": "Executive Table",
    "image": getImg("NKT-012", "Executive Table", "EXECUTIVE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.6m (L160cm x W80cm)", "1.8m (L180cm x W80cm)"],
            "prices": {
                "1.6m (L160cm x W80cm)": 18600.00,
                "1.8m (L180cm x W80cm)": 19200.00
            }
        }
    ]
  },
  {
    "id": "DB3020",
    "sku": "DB3020",
    "name": "EXECUTIVE L-TYPE TABLE",
    "description": "High-tech executive desk featuring integrated panel lights and a dual sliding door socket with USB and power cable ports. Includes premium combi-lock drawers and stylish pull handles. Available in 1.8m or 2.0m lengths.",
    "dimensions": "L180cm x W90cm x H75cm",
    "price": 26570.00,
    "category": "Executive Table",
    "image": getImg("DB3020", "Executive Table", "EXECUTIVE L-TYPE TABLE"),
    "stock": 10
  },
  {
    "id": "59-16",
    "sku": "59-16",
    "name": "EXECUTIVE L-TYPE TABLE",
    "description": "Modern 1.6m L-type desk with a high-quality MDF laminated finish. Features a unique sliding grommet for cable access and a side drawer unit with a secure combi-lock system.",
    "dimensions": "L160cm x W80cm x H75cm",
    "price": 18860.00,
    "category": "Executive Table",
    "image": getImg("59-16", "Executive Table", "EXECUTIVE L-TYPE TABLE"),
    "stock": 10
  },
  {
    "id": "03-2018",
    "sku": "03-2018",
    "name": "EXECUTIVE L-TYPE TABLE",
    "description": "Luxury executive desk with advanced connectivity options, including a sliding door socket with USB, power, and wireless charging. Features panel lighting and extensive secure storage. A statement piece for any executive office.",
    "dimensions": "L180cm x W80cm x H80cm",
    "price": 33430.00,
    "category": "Executive Table",
    "image": getImg("03-2018", "Executive Table", "EXECUTIVE L-TYPE TABLE"),
    "stock": 10
  },
  {
    "id": "ST104-16",
    "sku": "ST104-16",
    "name": "EXECUTIVE L-TYPE TABLE",
    "description": "Sleek 1.6m executive desk with a push-to-open cabinet mechanism. Offers wide legroom for comfort and a side drawer unit with a combi-lock system for security. Modern design meets functionality.",
    "dimensions": "L160cm x W80cm x H75cm",
    "price": 19730.00,
    "category": "Executive Table",
    "image": getImg("ST104-16", "Executive Table", "EXECUTIVE L-TYPE TABLE"),
    "stock": 10
  },
  {
    "id": "TR-142",
    "sku": "TR-142",
    "name": "EXECUTIVE TABLE (TR-142 Series)",
    "description": "Industrial-style executive table with a robust painted metal frame. Features a 25mm thick counter-top and a 15mm front panel. Includes a side extension for extra workspace. Durable and stylish.",
    "dimensions": "Varies by Selection",
    "price": 14110.00,
    "category": "Executive Table",
    "image": getImg("TR-142", "Executive Table", "EXECUTIVE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.4m", "1.6m", "1.8m", "2.0m"],
            "prices": {
                "1.4m": 14110.00,
                "1.6m": 15535.00,
                "1.8m": 16540.00,
                "2.0m": 17675.00
            }
        }
    ]
  },
  {
    "id": "MP-TR142",
    "sku": "MP-TR142",
    "name": "MOBILE PEDESTAL for TR-142",
    "description": "Matching mobile pedestal for the TR-142 series desks. Provides three drawers of personal storage on castors for easy mobility. Designed to fit perfectly under the TR-142 table.",
    "dimensions": "L40cm x W40cm x H62cm",
    "price": 2535.00,
    "category": "Cabinet & Storage",
    "image": getImg("MP-TR142", "Cabinet & Storage", "MOBILE PEDESTAL"),
    "stock": 10
  },
  {
    "id": "NKT023",
    "sku": "NKT023",
    "name": "EXECUTIVE TABLE",
    "description": "1.8m MDF executive table featuring secure combi-lock drawers. Integrated cable grommets keep cords organized. A solid and reliable choice for any private office.",
    "dimensions": "L180cm x W80cm x H75cm",
    "price": 12900.00,
    "category": "Executive Table",
    "image": getImg("NKT023", "Executive Table", "EXECUTIVE TABLE"),
    "stock": 10
  },
  {
    "id": "LPMA27",
    "sku": "LPMA27",
    "name": "EXECUTIVE TABLE SET",
    "description": "Complete executive desk set including a main table with a durable steel frame, a mobile pedestal, and a side drawer unit. Available in Brown Oak with Black or White frame options.",
    "dimensions": "Varies by Selection",
    "price": 17740.00,
    "category": "Executive Table",
    "image": getImg("LPMA27", "Executive Table", "EXECUTIVE TABLE SET"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.6m", "1.8m"],
            "prices": {
                "1.6m": 17740.00,
                "1.8m": 19000.00
            }
        }
    ]
  },
  {
    "id": "LPMA26",
    "sku": "LPMA26",
    "name": "EXECUTIVE TABLE SET (LPMA26)",
    "description": "Executive set featuring a steel frame desk, mobile pedestal, and side drawer. Modular design allows items to be purchased separately or as a complete workstation package.",
    "dimensions": "Varies by Selection",
    "price": 17740.00,
    "category": "Executive Table",
    "image": getImg("LPMA26", "Executive Table", "EXECUTIVE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.6m", "1.8m"],
            "prices": {
                "1.6m": 17740.00,
                "1.8m": 19000.00
            }
        }
    ]
  },
  {
    "id": "MP-26",
    "sku": "MP-26",
    "name": "MOBILE PEDESTAL for LPMA26/27",
    "description": "Heavy-duty mobile pedestal with 3 drawers and ball bearing runners. Features a gang locking system with 2 keys for security. Fits seamlessly with LPMA26 and LPMA27 series desks.",
    "dimensions": "L40cm x W41cm x H62cm",
    "price": 2535.00,
    "category": "Cabinet & Storage",
    "image": getImg("MP-26", "Cabinet & Storage", "MOBILE PEDESTAL"),
    "stock": 10
  },
  {
    "id": "SD-26",
    "sku": "SD-26",
    "name": "SIDE DRAWER for LPMA26/27",
    "description": "Side cabinet extension for LPMA series. Includes 2 internal shelves and drawers with a gang lock system. Adds significant storage capacity and workspace to your desk setup.",
    "dimensions": "L80cm x W40cm x H75cm",
    "price": 4670.00,
    "category": "Cabinet & Storage",
    "image": getImg("SD-26", "Cabinet & Storage", "SIDE DRAWER"),
    "stock": 10
  },
  {
    "id": "IFTABLEONLY",
    "sku": "IFTABLEONLY",
    "name": "TABLE ONLY (LPMA 26&27 Series)",
    "description": "Standalone office table from the LPMA series. Features the signature durable steel frame and high-quality table top. Ideal if you already have storage solutions.",
    "dimensions": "Varies by Selection",
    "price": 10535.00,
    "category": "Office Table",
    "image": getImg("IFTABLEONLY", "Office Table", "OFFICE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.6m", "1.8m"],
            "prices": {
                "1.6m": 10535.00,
                "1.8m": 11800.00
            }
        }
    ]
  },
  {
    "id": "SH-3014",
    "sku": "SH-3014",
    "name": "L-TYPE OFFICE TABLE",
    "description": "Ergonomic L-type desk with curved edges for comfort. Includes a system unit bin, combi-lock side drawers, storage cabinets, and a USB-equipped cable grommet. Maximizes utility in a compact L-shape.",
    "dimensions": "L140cm x W60cm x H75cm",
    "price": 12600.00,
    "category": "Office Table",
    "image": getImg("SH-3014", "Office Table", "L-TYPE OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "SQ-7904",
    "sku": "SQ-7904",
    "name": "L-TYPE OFFICE TABLE",
    "description": "Compact L-shaped workstation with a CPU bin, combi-lock drawers, and storage cabinets. Features integrated cable management. Perfect for efficient use of office corner spaces.",
    "dimensions": "L140cm x W60cm x H75cm",
    "price": 9600.00,
    "category": "Office Table",
    "image": getImg("SQ-7904", "Office Table", "L-TYPE OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "OT-1415",
    "sku": "OT-1415",
    "name": "L-TYPE OFFICE TABLE",
    "description": "Functional L-type desk featuring an integrated side table with shelving (H110cm). Includes wide legroom and a combi-lock drawer for security. Available in Brown or Oak finishes.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 10700.00,
    "category": "Office Table",
    "image": getImg("OT-1415", "Office Table", "L-TYPE OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "LT1.4M",
    "sku": "LT1.4M",
    "name": "L-TYPE OFFICE TABLE",
    "description": "Simple and effective L-type desk with a scratch-proof melamine surface. Reversible design allows the side table to be installed on the left or right. Offers generous legroom and basic cable management.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 6670.00,
    "category": "Office Table",
    "image": getImg("LT1.4M", "Office Table", "L-TYPE OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "NKT-0011",
    "sku": "NKT-0011",
    "name": "GLASS TOP OFFICE TABLE",
    "description": "Modern office desk with a 12mm tempered glass top. Features thick 50mm melamine legs and a 15mm front panel. Includes 3 drawers secured by a gang lock system for file storage.",
    "dimensions": "Varies by Selection",
    "price": 9240.00,
    "category": "Office Table",
    "image": getImg("NKT-0011", "Office Table", "GLASS TOP OFFICE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.2m (L120cm x W60cm)", "1.4m (L140cm x W70cm)"],
            "prices": {
                "1.2m (L120cm x W60cm)": 9240.00,
                "1.4m (L140cm x W70cm)": 10135.00
            }
        }
    ]
  },
  {
    "id": "AMS7907",
    "sku": "AMS7907",
    "name": "FOLDABLE OFFICE TABLE",
    "description": "Versatile 1.2m foldable table with a durable tubular frame and caster wheels for mobility. Features a space-saving design perfect for training rooms or flexible workspaces. Available in multiple color combinations.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 4975.00,
    "category": "Office Table",
    "image": getImg("AMS7907", "Office Table", "FOLDABLE OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "TT-F-TABLES",
    "sku": "TT-F-TABLES",
    "name": "FOLDABLE TABLE",
    "description": "Versatile foldable training table available in narrow (40cm) and wide (60cm) configurations. Sturdy tubular steel frame and MDF top. Ideal for seminar setups, tight spaces, or temporary workstations.",
    "dimensions": "Varies by Selection",
    "price": 3270.00,
    "category": "Office Table",
    "image": getImg("TT-F-TABLES", "Office Table", "FOLDABLE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size & Depth",
            "options": [
                "1.2m Narrow (120x40cm)", "1.2m Wide (120x60cm)",
                "1.4m Narrow (140x40cm)", "1.4m Wide (140x60cm)",
                "1.6m Narrow (160x40cm)", "1.6m Wide (160x60cm)",
                "1.8m Narrow (180x40cm)", "1.8m Wide (180x60cm)"
            ],
            "prices": {
                "1.2m Narrow (120x40cm)": 3270.00,
                "1.2m Wide (120x60cm)": 3700.00,
                "1.4m Narrow (140x40cm)": 3335.00,
                "1.4m Wide (140x60cm)": 3800.00,
                "1.6m Narrow (160x40cm)": 3600.00,
                "1.6m Wide (160x60cm)": 4000.00,
                "1.8m Narrow (180x40cm)": 3670.00,
                "1.8m Wide (180x60cm)": 4170.00
            }
        }
    ]
  },
  {
    "id": "TTFME",
    "sku": "TTFME",
    "name": "FOLDABLE TABLE FRAME ONLY",
    "description": "Replacement frame for foldable tables. Includes the folding mechanism and legs. Ideal for DIY projects or repairing existing tables. Sturdy tubular steel construction. Table top not included.",
    "dimensions": "Varies by Selection",
    "price": 1650.00,
    "category": "Office Table",
    "image": getImg("TTFME", "Office Table", "FOLDABLE TABLE FRAME"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.2m", "1.6m"],
            "prices": {
                "1.2m": 1650.00,
                "1.6m": 1950.00
            }
        }
    ]
  },
  {
    "id": "RK-BGZ1040AG",
    "sku": "RK-BGZ1040AG",
    "name": "STUDY TABLE",
    "description": "Simple 1.0m study table with a laminated wood top and tubular steel legs. A cost-effective and durable solution for students or home workstations.",
    "dimensions": "L100cm x W40cm x H70cm",
    "price": 1560.00,
    "category": "Office Table",
    "image": getImg("RK-BGZ1040AG", "Office Table", "STUDY TABLE"),
    "stock": 10
  },
  {
    "id": "RK-SZ954876LG",
    "sku": "RK-SZ954876LG",
    "name": "STUDY TABLE",
    "description": "Compact study desk featuring a built-in drawer for supplies. Constructed with laminated wood and a sturdy steel frame. Perfect for small bedrooms or dorms.",
    "dimensions": "L95cm x W48cm x H76cm",
    "price": 2895.00,
    "category": "Office Table",
    "image": getImg("RK-SZ954876LG", "Office Table", "STUDY TABLE"),
    "stock": 10
  },
  {
    "id": "RK-SZ1025885",
    "sku": "RK-SZ1025885",
    "name": "STUDY TABLE",
    "description": "Space-saving study table with an integrated side rack for books and storage. The vertical design maximizes utility in a small footprint. Laminated wood finish.",
    "dimensions": "L102cm x W58cm x H85cm",
    "price": 4750.00,
    "category": "Office Table",
    "image": getImg("RK-SZ1025885", "Office Table", "STUDY TABLE"),
    "stock": 10
  },
  {
    "id": "RK-BGZ1207375G",
    "sku": "RK-BGZ1207375G",
    "name": "L-TYPE STUDY TABLE",
    "description": "1.2m L-shaped study desk providing extra corner workspace. Features a simple, open design with a robust tubular steel frame and laminated surface.",
    "dimensions": "L120cm x W73cm x H75cm",
    "price": 2220.00,
    "category": "Office Table",
    "image": getImg("RK-BGZ1207375G", "Office Table", "L-TYPE STUDY TABLE"),
    "stock": 10
  },
  {
    "id": "RK-DNZ1048DG",
    "sku": "RK-DNZ1048DG",
    "name": "STUDY TABLE",
    "description": "Study table equipped with a tall side rack (H122cm) for maximum vertical storage. Ideal for organizing textbooks, binders, and decor. Durable construction.",
    "dimensions": "L100cm x W52cm x H122cm",
    "price": 2750.00,
    "category": "Office Table",
    "image": getImg("RK-DNZ1048DG", "Office Table", "STUDY TABLE"),
    "stock": 10
  },
  {
    "id": "SH-512",
    "sku": "SH-512",
    "name": "JR. OFFICE TABLE",
    "description": "1.2m Junior Office Table with a curved edge top for ergonomic comfort. Features combi-lock side drawers, storage cabinets, and a USB-equipped grommet. A fully-featured desk in a compact size.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 6250.00,
    "category": "Office Table",
    "image": getImg("SH-512", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "OT-812",
    "sku": "OT-812",
    "name": "JR. OFFICE TABLE",
    "description": "Two-tone 1.2m office desk featuring 3 secure drawers with a central lock mechanism. Includes cable grommets for wire management. A classic choice for administrative workstations.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 6680.00,
    "category": "Office Table",
    "image": getImg("OT-812", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "OT5003 / OT614",
    "sku": "OT5003 / OT614",
    "name": "JR. OFFICE TABLE",
    "description": "1.4m melamine office desk with soft-close cabinet doors. Features a clean design with essential cable management grommets. Built for daily office use.",
    "dimensions": "L140cm x W70cm x H75cm",
    "price": 8250.00,
    "category": "Office Table",
    "image": getImg("OT5003", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "OT614",
    "sku": "OT614",
    "name": "JR. OFFICE TABLE",
    "description": "Feature-rich 1.4m desk with a ventilated CPU bin, keyboard tray, and elevated monitor shelf. Includes 3 safety-lock drawers. Designed for computer-intensive workstations.",
    "dimensions": "L140cm x W70cm x H75cm",
    "price": 8670.00,
    "category": "Office Table",
    "image": getImg("OT614", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "NKT-011 (OTB1204)",
    "sku": "NKT-011 (OTB1204)",
    "name": "JR. OFFICE TABLE",
    "description": "1.4m two-tone desk with a mobile pedestal on caster wheels for flexible storage. Features gang-locked drawers and wide legroom. Made from durable MDF board.",
    "dimensions": "L140cm x W70cm x H75cm",
    "price": 9500.00,
    "category": "Office Table",
    "image": getImg("NKT-011", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "OT-143M-SERIES",
    "sku": "OT-143M-SERIES",
    "name": "JR. OFFICE TABLE (OT-143/123 Series)",
    "description": "PVC laminated desk with extensive storage. Includes lockable side drawers and a central drawer for stationery. A practical, all-in-one desk solution.",
    "dimensions": "Varies by Selection",
    "price": 7250.00,
    "category": "Office Table",
    "image": getImg("OT-143M-SERIES", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.2m (OT-123M)", "1.4m (OT-143M)"],
            "prices": {
                "1.2m (OT-123M)": 7250.00,
                "1.4m (OT-143M)": 8920.00
            }
        }
    ]
  },
  {
    "id": "NKT-009 (OT-814)",
    "sku": "NKT-009 (OT-814)",
    "name": "JR. OFFICE TABLE",
    "description": "Classic 1.4m two-tone office table in Brown. Features a stack of 3 drawers with a safety lock system. Reliable and functional for general office tasks.",
    "dimensions": "L140cm x W70cm x H75cm",
    "price": 9100.00,
    "category": "Office Table",
    "image": getImg("NKT-009", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "OT-7000-SERIES",
    "sku": "OT-7000-SERIES",
    "name": "JR. OFFICE TABLE (7000 Series)",
    "description": "Melamine desk designed for computer users. Includes a dedicated CPU bin, keyboard tray, and cable grommets. Keeps your workspace organized and efficient.",
    "dimensions": "Varies by Selection",
    "price": 5400.00,
    "category": "Office Table",
    "image": getImg("OT-7000-SERIES", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.2m (OT-7002)", "1.4m (OT-7003)"],
            "prices": {
                "1.2m (OT-7002)": 5400.00,
                "1.4m (OT-7003)": 7000.00
            }
        }
    ]
  },
  {
    "id": "NKT-0101",
    "sku": "NKT-0101",
    "name": "JR. OFFICE TABLE (NKT Series)",
    "description": "Desk offering generous legroom and 3 pull-out drawers for storage. Finished in a professional Brown melamine. Simple, sturdy, and effective.",
    "dimensions": "Varies by Selection",
    "price": 8290.00,
    "category": "Office Table",
    "image": getImg("NKT-0101", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.2m (7008)", "1.4m (7009)"],
            "prices": {
                "1.2m (7008)": 8290.00,
                "1.4m (7009)": 9000.00
            }
        }
    ]
  },
  {
    "id": "NKT-0061",
    "sku": "NKT-0061",
    "name": "JR. OFFICE TABLE",
    "description": "Two-tone desk featuring a soft-close cabinet with concealed hinges and a combi-lock drawer. Available in Brown or Orange accents. Modern and functional.",
    "dimensions": "Varies by Selection",
    "price": 4550.00,
    "category": "Office Table",
    "image": getImg("NKT-0061", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.2m (OT112)", "1.4m (OT114)"],
            "prices": {
                "1.2m (OT112)": 4550.00,
                "1.4m (OT114)": 5750.00
            }
        }
    ]
  },
  {
    "id": "OT-608B-SERIES",
    "sku": "OT-608B-SERIES",
    "name": "JR. OFFICE TABLE",
    "description": "Scratch-proof melamine desk with extensive security features. Includes a central lock for side drawers, a center drawer lock, and a lockable cabinet. Ideal for handling confidential materials.",
    "dimensions": "Varies by Selection",
    "price": 4870.00,
    "category": "Office Table",
    "image": getImg("OT-608B-SERIES", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.2m (OT-208B)", "1.4m (OT-608B)"],
            "prices": {
                "1.2m (OT-208B)": 4870.00,
                "1.4m (OT-608B)": 5900.00
            }
        }
    ]
  },
  {
    "id": "OT-9022",
    "sku": "OT-9022",
    "name": "JR. OFFICE TABLE",
    "description": "Minimalist two-tone desk. Features a clean design with no drawers, offering maximum legroom and flexibility. Includes cable grommets for simple wire management.",
    "dimensions": "Varies by Selection",
    "price": 4670.00,
    "category": "Office Table",
    "image": getImg("OT-9022", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.2m", "1.4m"],
            "prices": {
                "1.2m": 4670.00,
                "1.4m": 6000.00
            }
        }
    ]
  },
  {
    "id": "SQ-1712",
    "sku": "SQ-1712",
    "name": "JR. OFFICE TABLE",
    "description": "1.2m two-tone desk with 2 integrated drawers. A basic yet effective workstation for general office tasks. Sturdy construction with a modern look.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 4550.00,
    "category": "Office Table",
    "image": getImg("SQ-1712", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "OT-209",
    "sku": "OT-209",
    "name": "JR. OFFICE TABLE",
    "description": "1.2m Oak-finished desk with a scratch-proof melamine top. Features 3 safety-locked drawers and a pull-out keyboard/utility drawer. A warm and functional addition to the office.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 4660.00,
    "category": "Office Table",
    "image": getImg("OT-209", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "OT-108-SERIES",
    "sku": "OT-108-SERIES",
    "name": "JR. OFFICE TABLE (Compact Series)",
    "description": "Compact desk suitable for tight spaces. Features the same durable build quality and locking drawers as larger models. Ideal for home study or small cubicles.",
    "dimensions": "Varies by Selection",
    "price": 3000.00,
    "category": "Office Table",
    "image": getImg("OT-108-SERIES", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["80cm (OT-089B)", "1.0m (OT-108)"],
            "prices": {
                "80cm (OT-089B)": 3000.00,
                "1.0m (OT-108)": 3760.00
            }
        }
    ]
  },
  {
    "id": "OT-9012",
    "sku": "OT-9012",
    "name": "JR. OFFICE TABLE",
    "description": "1.2m two-tone desk with comprehensive storage. Includes 3 safety-locked side drawers and a central drawer. Available in Brown or Oak to match your office theme.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 5170.00,
    "category": "Office Table",
    "image": getImg("OT-9012", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "OT-9011A",
    "sku": "OT-9011A",
    "name": "JR. OFFICE TABLE",
    "description": "Compact desk with 3 lockable drawers. Offers secure storage in a small footprint. Available in Brown or Oak finishes. Great for individual focused work.",
    "dimensions": "Varies by Selection",
    "price": 4370.00,
    "category": "Office Table",
    "image": getImg("OT-9011A", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["1.0m", "1.2m"],
            "prices": {
                "1.0m": 4370.00,
                "1.2m": 5000.00
            }
        }
    ]
  },
  {
    "id": "OT-1206",
    "sku": "OT-1206",
    "name": "JR. OFFICE TABLE",
    "description": "1.2m metal-framed desk with a two-tone finish. Features lockable drawers and a storage cabinet. The metal frame adds durability and industrial style to the workspace.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 5745.00,
    "category": "Office Table",
    "image": getImg("OT-1206", "Office Table", "JR. OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "OT-1788",
    "sku": "OT-1788",
    "name": "METAL OFFICE TABLE",
    "description": "1.2m office table with a powder-coated black metal frame and MDF top. Available in Beech or Gray. A simple, robust desk with cable grommets, suitable for rugged office environments.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 5700.00,
    "category": "Office Table",
    "image": getImg("OT-1788", "Office Table", "METAL OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "GF-Z014",
    "sku": "GF-Z014",
    "name": "METAL OFFICE TABLE",
    "description": "1.2m metal-framed desk with a clean MDF top. Features a minimalist design with a cable grommet. The powder-coated stand ensures stability and longevity.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 5145.00,
    "category": "Office Table",
    "image": getImg("GF-Z014", "Office Table", "METAL OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "GF-Z010",
    "sku": "GF-Z010",
    "name": "METAL OFFICE TABLE",
    "description": "1.2m metal desk with integrated storage. Features 3 lockable side drawers and a central pull-out drawer. Built on a sturdy powder-coated metal frame for heavy use.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 7890.00,
    "category": "Office Table",
    "image": getImg("GF-Z010", "Office Table", "METAL OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "ODK1A",
    "sku": "ODK1A",
    "name": "METAL OFFICE TABLE",
    "description": "Heavy-duty 1.2m metal office desk. Features a center drawer and a gang-locked side drawer unit. Powder-coated finish resists wear. Includes wiring holes for cable management.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 12400.00,
    "category": "Office Table",
    "image": getImg("ODK1A", "Office Table", "METAL OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "ODKH",
    "sku": "ODKH",
    "name": "METAL OFFICE TABLE (Variant)",
    "description": "1.2m metal desk variant featuring a sliding keyboard tray. Offers the same robust construction and secure storage as the ODK1A. Ideal for desktop computer setups.",
    "dimensions": "L120cm x W60cm x H75cm",
    "price": 12000.00,
    "category": "Office Table",
    "image": getImg("ODKH", "Office Table", "METAL OFFICE TABLE"),
    "stock": 10
  },
  {
    "id": "B12045-L-TYPE",
    "sku": "B12045-L-TYPE",
    "name": "PARTITION (L-Type Cubicle)",
    "description": "L-Type workstation cubicle system. Includes 25mm laminated table top, laminated panels, clear glass top partition, and aluminum trimming. Provides privacy and a dedicated workspace. Available in various configurations.",
    "dimensions": "Varies by Selection",
    "price": 25715.00,
    "category": "Partition",
    "image": getImg("B12045-L-TYPE", "Partition", "PARTITION L-Type Cubicle"),
    "stock": 10,
    "variants": [
        {
            "name": "Capacity",
            "options": ["1-Person", "2-Person", "3-Person", "4-Person", "6-Person"],
            "prices": {
                "1-Person": 25715.00,
                "2-Person": 45715.00,
                "3-Person": 70480.00,
                "4-Person": 89525.00,
                "6-Person": 132380.00
            }
        }
    ]
  },
  {
    "id": "B12045-STRAIGHT",
    "sku": "B12045-STRAIGHT",
    "name": "PARTITION (Straight-Type)",
    "description": "Straight-type workstation system. Compact 60x120cm footprint per person. Features 25mm laminated top, privacy panels, and cable grommets. Excellent for call centers or high-density offices.",
    "dimensions": "Varies by Selection",
    "price": 17145.00,
    "category": "Partition",
    "image": getImg("B12045-STRAIGHT", "Partition", "PARTITION Straight-Type"),
    "stock": 10,
    "variants": [
        {
            "name": "Capacity",
            "options": ["1-Person", "2-Person", "3-Person", "4-Person", "6-Person"],
            "prices": {
                "1-Person": 17145.00,
                "2-Person": 28575.00,
                "3-Person": 38100.00,
                "4-Person": 42285.00,
                "6-Person": 57145.00
            }
        }
    ]
  },
  {
    "id": "PARTITION-GLASS",
    "sku": "PARTITION-GLASS",
    "name": "PARTITION FROSTED GLASS",
    "description": "Frosted glass partition panel. Adds privacy and style to existing workstations without blocking light. Compatible with modular partition systems. Available in various widths.",
    "dimensions": "Varies by Selection",
    "price": 190.00,
    "category": "Partition",
    "image": getImg("PARTITION-GLASS", "Partition", "PARTITION FROSTED GLASS"),
    "stock": 10,
    "variants": [
        {
            "name": "Size",
            "options": ["45cm x 25cm", "60cm x 25cm", "120cm x 25cm", "140cm x 25cm"],
            "prices": {
                "45cm x 25cm": 190.00,
                "60cm x 25cm": 190.00,
                "120cm x 25cm": 380.00,
                "140cm x 25cm": 450.00
            }
        }
    ]
  },
  {
    "id": "1FMDF4MBL",
    "sku": "1FMDF4MBL",
    "name": "PLYWOOD: 4mm MDF Single Face Board",
    "description": "4mm thick Medium Density Fiberboard with single-face lamination. 8ft x 4ft sheet. Ideal for cabinetry backing or lightweight paneling projects.",
    "dimensions": "8ft x 4ft",
    "price": 825.00,
    "category": "Accessories",
    "image": getImg("1FMDF4MBL", "Accessories", "MDF Board"),
    "stock": 10
  },
  {
    "id": "2FMDF25MOW",
    "sku": "2FMDF25MOW",
    "name": "PLYWOOD: 25mm MDF Double Face Board",
    "description": "Heavy-duty 25mm MDF board with double-face lamination. 8ft x 4ft sheet. Suitable for table tops, shelving, and robust furniture construction.",
    "dimensions": "8ft x 4ft",
    "price": 2000.00,
    "category": "Accessories",
    "image": getImg("2FMDF25MOW", "Accessories", "MDF Board"),
    "stock": 10
  },
  {
    "id": "NLMDF25MM",
    "sku": "NLMDF25MM",
    "name": "25mm MDF (no laminate)",
    "description": "Raw 25mm MDF board, 8ft x 6ft. Perfect for custom painting or finishing. Provides a smooth, stable surface for various joinery applications.",
    "dimensions": "8ft x 6ft",
    "price": 2500.00,
    "category": "Accessories",
    "image": getImg("NLMDF25MM", "Accessories", "MDF Board"),
    "stock": 10
  },
  {
    "id": "CTF240FME",
    "sku": "CTF240FME",
    "name": "CONFERENCE TABLE FRAME",
    "description": "Robust tubular steel frame for 2.4m conference tables. Features a powder-coated finish and an integrated aluminum outlet panel for connectivity. Table top not included.",
    "dimensions": "240cm x 120cm",
    "price": 5660.00,
    "category": "Reception & Conference",
    "image": getImg("CTF240FME", "Reception & Conference", "CONFERENCE TABLE FRAME"),
    "stock": 10
  },
  {
    "id": "MCTFME",
    "sku": "MCTFME",
    "name": "MINI-CONFERENCE TABLE FRAME/STAND",
    "description": "Steel frame stand for small round or square meeting tables. Powder-coated for durability. Ideal for creating casual meeting spots.",
    "dimensions": "Standard Size",
    "price": 2125.00,
    "category": "Reception & Conference",
    "image": getImg("MCTFME", "Reception & Conference", "CONFERENCE TABLE FRAME"),
    "stock": 10
  },
  {
    "id": "OPHCTFME1.2M",
    "sku": "OPHCTFME1.2M",
    "name": "OFFICE TABLE FRAME",
    "description": "1.2m tubular steel desk frame. Powder-coated finish. A solid base for DIY desk projects or replacing damaged frames.",
    "dimensions": "120cm x 60cm",
    "price": 1970.00,
    "category": "Office Table",
    "image": getImg("OPHCTFME1.2M", "Office Table", "OFFICE TABLE FRAME"),
    "stock": 10
  },
  {
    "id": "ALOLTPNL",
    "sku": "ALOLTPNL",
    "name": "ALUMINUM OUTLET PANEL",
    "description": "Rectangular aluminum outlet box cover. Powder-coated finish. Essential for organizing power and data connections on conference tables.",
    "dimensions": "Standard Size",
    "price": 365.00,
    "category": "Accessories",
    "image": getImg("ALOLTPNL", "Accessories", "ALUMINUM OUTLET PANEL"),
    "stock": 10
  },
  {
    "id": "DD80x30",
    "sku": "DD80x30",
    "name": "DESK DIVIDER",
    "description": "80cm x 30cm privacy screen made of durable plastic. Easily attaches to desks to create focused workspaces. Simple and effective.",
    "dimensions": "80cm x 30cm",
    "price": 325.00,
    "category": "Accessories",
    "image": getImg("DD80x30", "Accessories", "DESK DIVIDER"),
    "stock": 10
  },
  {
    "id": "DDC",
    "sku": "DDC",
    "name": "DESK DIVIDER CLIP",
    "description": "Metal clamp for securing desk dividers. Durable and easy to install. Ensures partitions remain stable.",
    "dimensions": "Standard Size",
    "price": 48.00,
    "category": "Accessories",
    "image": getImg("DDC", "Accessories", "DESK DIVIDER CLIP"),
    "stock": 10
  },
  {
    "id": "CT1708FME1.2M",
    "sku": "CT1708FME1.2M",
    "name": "OFFICE TABLE FRAME",
    "description": "Premium 1.2m steel table frame. Enhanced stability with a powder-coated finish. Suitable for heavier table tops.",
    "dimensions": "120cm x 60cm",
    "price": 3000.00,
    "category": "Office Table",
    "image": getImg("CT1708FME1.2M", "Office Table", "OFFICE TABLE FRAME"),
    "stock": 10
  },
  {
    "id": "WLS-067 (XS-GD2)",
    "sku": "WLS-067 (XS-GD2)",
    "name": "METAL RACK",
    "description": "Heavy-duty 1.2m metal shelving unit. Powder-coated finish. Holds up to 120kg per shelf. Ideal for archives, warehouse storage, or office supplies.",
    "dimensions": "L120cm x W45cm x H183cm",
    "price": 6195.00,
    "category": "Cabinet & Storage",
    "image": getImg("WLS-067", "Cabinet & Storage", "METAL RACK"),
    "stock": 10
  },
  {
    "id": "WLS-066 (XS-GD)",
    "sku": "WLS-066 (XS-GD)",
    "name": "METAL RACK (Variant)",
    "description": "90cm wide metal storage rack. Features fully adjustable shelves and a total load capacity of 600kg. Easy boltless assembly. Available in Black or Gray.",
    "dimensions": "L90cm x W45cm x H183cm",
    "price": 5145.00,
    "category": "Cabinet & Storage",
    "image": getImg("WLS-066", "Cabinet & Storage", "METAL RACK"),
    "stock": 10
  },
  {
    "id": "XS-OD120cm",
    "sku": "XS-OD120cm",
    "name": "METAL RACK",
    "description": "Extra-tall 2.0m metal rack (1.2m width). Max capacity 720kg. Powder-coated for rust resistance. Perfect for maximizing vertical storage space.",
    "dimensions": "L120cm x W45cm x H200cm",
    "price": 8935.00,
    "category": "Cabinet & Storage",
    "image": getImg("XS-OD120cm", "Cabinet & Storage", "METAL RACK"),
    "stock": 10
  },
  {
    "id": "XS-OD90cm",
    "sku": "XS-OD90cm",
    "name": "METAL RACK (Variant)",
    "description": "2.0m tall, 90cm wide metal rack. High capacity and adjustable shelving. Robust solution for storing heavy items or boxes.",
    "dimensions": "L90cm x W45cm x H200cm",
    "price": 7915.00,
    "category": "Cabinet & Storage",
    "image": getImg("XS-OD90cm", "Cabinet & Storage", "METAL RACK"),
    "stock": 10
  },
  {
    "id": "GFHF006",
    "sku": "GFHF006",
    "name": "METAL MOBILE PEDESTAL",
    "description": "Premium metal mobile pedestal with 3 drawers (2 personal, 1 filing). Features a pencil tray, heavy-duty ball bearing runners, and a gang lock system. Electrostatic powder coating for a durable finish.",
    "dimensions": "L40cm x W56cm x H66cm",
    "price": 4670.00,
    "category": "Cabinet & Storage",
    "image": getImg("GFHF006", "Cabinet & Storage", "METAL MOBILE PEDESTAL"),
    "stock": 10
  },
  {
    "id": "L-101-F",
    "sku": "L-101-F",
    "name": "METAL MOBILE PEDESTAL (Variant)",
    "description": "Compact metal mobile pedestal. Offers secure storage under your desk. Durable steel construction with smooth-gliding drawers.",
    "dimensions": "L39cm x W50cm x H60cm",
    "price": 3850.00,
    "category": "Cabinet & Storage",
    "image": getImg("L-101-F", "Cabinet & Storage", "METAL MOBILE PEDESTAL"),
    "stock": 10
  },
  {
    "id": "DG-D4",
    "sku": "DG-D4",
    "name": "FILING CABINET (4 drawers)",
    "description": "4-drawer vertical steel filing cabinet. Fits legal and letter size folders. Features full-extension ball bearing runners and a superior gang locking system. Essential for document archives.",
    "dimensions": "L62cm x W46cm x H134cm",
    "price": 8000.00,
    "category": "Cabinet & Storage",
    "image": getImg("DG-D4", "Cabinet & Storage", "FILING CABINET"),
    "stock": 10
  },
  {
    "id": "DG3",
    "sku": "DG3",
    "name": "FILING CABINET (3 drawers)",
    "description": "3-drawer version of our vertical steel filing cabinet. Offers the same secure document storage and smooth operation in a shorter unit.",
    "dimensions": "L62cm x W46cm x H103cm",
    "price": 6800.00,
    "category": "Cabinet & Storage",
    "image": getImg("DG3", "Cabinet & Storage", "FILING CABINET"),
    "stock": 10
  },
  {
    "id": "LD-A2",
    "sku": "LD-A2",
    "name": "LATERAL FILING CABINET",
    "description": "2-drawer lateral filing cabinet. Wide design allows for side-by-side file storage. Features anti-tilt mechanism, full-width handles, and a gang lock. Gauge 22 steel construction.",
    "dimensions": "L90cm x W45cm x H72cm",
    "price": 6700.00,
    "category": "Cabinet & Storage",
    "image": getImg("LD-A2", "Cabinet & Storage", "LATERAL FILING CABINET"),
    "stock": 10
  },
  {
    "id": "LD-A3",
    "sku": "LD-A3",
    "name": "LATERAL FILING CABINET (3 drawers)",
    "description": "3-drawer lateral file cabinet. Provides 50% more storage than the 2-drawer model. Heavy-duty ball bearing runners ensure drawers open smoothly even when full.",
    "dimensions": "L90cm x W45cm x H103cm",
    "price": 9300.00,
    "category": "Cabinet & Storage",
    "image": getImg("LD-A3", "Cabinet & Storage", "LATERAL FILING CABINET"),
    "stock": 10
  },
  {
    "id": "LD-A4",
    "sku": "LD-A4",
    "name": "LATERAL FILING CABINET (4 drawers)",
    "description": "4-drawer lateral filing cabinet for maximum document density. Sturdy steel build (Gauge 22) with powder coating. Central locking system secures all drawers simultaneously.",
    "dimensions": "L90cm x W45cm x H133cm",
    "price": 11300.00,
    "category": "Cabinet & Storage",
    "image": getImg("LD-A4", "Cabinet & Storage", "LATERAL FILING CABINET"),
    "stock": 10
  },
  {
    "id": "WLS-004-4D",
    "sku": "WLS-004-4D",
    "name": "LATERAL FILING CABINET (4 drawers)",
    "description": "WLS Series 4-drawer lateral cabinet. Sleek design with recessed handles. High-capacity filing solution with durable powder-coated finish.",
    "dimensions": "L90cm x W45cm x H133cm",
    "price": 11300.00,
    "category": "Cabinet & Storage",
    "image": getImg("WLS-004-4D", "Cabinet & Storage", "LATERAL FILING CABINET"),
    "stock": 10
  },
  {
    "id": "WLS-004-3D",
    "sku": "WLS-004-3D",
    "name": "LATERAL FILING CABINET (3 drawers)",
    "description": "WLS Series 3-drawer lateral cabinet. Perfect for medium-volume filing needs. Smooth drawer operation and robust security features.",
    "dimensions": "L90cm x W45cm x H103cm",
    "price": 9300.00,
    "category": "Cabinet & Storage",
    "image": getImg("WLS-004-3D", "Cabinet & Storage", "LATERAL FILING CABINET"),
    "stock": 10
  },
  {
    "id": "FC-A18 (WLS-024)",
    "sku": "FC-A18 (WLS-024)",
    "name": "METAL CABINET",
    "description": "Full-height metal storage cabinet with swing doors. Includes 5 adjustable shelves for versatile storage of supplies, boxes, or binders. Gauge 22 steel with powder coating.",
    "dimensions": "L90cm x W40cm x H185cm",
    "price": 10835.00,
    "category": "Cabinet & Storage",
    "image": getImg("FC-A18", "Cabinet & Storage", "METAL CABINET"),
    "stock": 10
  },
  {
    "id": "WLS-026",
    "sku": "WLS-026",
    "name": "METAL CABINET",
    "description": "Multi-functional metal locker/cabinet. Features a mix of shelving space, a clothes hanging rod, and a lockable compartment. Ideal for staff personal storage.",
    "dimensions": "L90cm x W50cm x H185cm",
    "price": 10835.00,
    "category": "Cabinet & Storage",
    "image": getImg("WLS-026", "Cabinet & Storage", "METAL CABINET"),
    "stock": 10
  },
  {
    "id": "FC-H3 (WLS-038)",
    "sku": "FC-H3 (WLS-038)",
    "name": "METAL CABINET",
    "description": "Combination metal cabinet featuring a glass-door top section, 2 central drawers, and a solid-door bottom section. Perfect for display and secure storage in one unit.",
    "dimensions": "L90cm x W42cm x H185cm",
    "price": 11170.00,
    "category": "Cabinet & Storage",
    "image": getImg("FC-H3", "Cabinet & Storage", "METAL CABINET"),
    "stock": 10
  },
  {
    "id": "FC-G5 (WLS-028)",
    "sku": "FC-G5 (WLS-028)",
    "name": "METAL CABINET",
    "description": "Glass-door metal cabinet with 5 adjustable shelves. Allows for visibility of contents while keeping them dust-free and secure. Ideal for medical or laboratory use.",
    "dimensions": "L90cm x W45cm x H180cm",
    "price": 9950.00,
    "category": "Cabinet & Storage",
    "image": getImg("FC-G5", "Cabinet & Storage", "METAL CABINET"),
    "stock": 10
  },
  {
    "id": "WLS-017",
    "sku": "WLS-017",
    "name": "METAL CABINET",
    "description": "Low-height metal sliding door cabinet with glass. Features 3 adjustable shelves. A great console unit for offices, offering storage surface and visibility.",
    "dimensions": "L90cm x W40cm x H105cm",
    "price": 7150.00,
    "category": "Cabinet & Storage",
    "image": getImg("WLS-017", "Cabinet & Storage", "METAL CABINET"),
    "stock": 10
  },
  {
    "id": "FC-G6 (WLS-021)",
    "sku": "FC-G6 (WLS-021)",
    "name": "METAL CABINET",
    "description": "Full glass sliding door cabinet. 5 adjustable shelves maximize vertical storage efficiency. Smooth ball bearing door runners and secure lock.",
    "dimensions": "L90cm x W40cm x H180cm",
    "price": 10835.00,
    "category": "Cabinet & Storage",
    "image": getImg("FC-G6", "Cabinet & Storage", "METAL CABINET"),
    "stock": 10
  },
  {
    "id": "WLS-041",
    "sku": "WLS-041",
    "name": "METAL DISPLAY CABINET",
    "description": "Modern low display cabinet with magnetic swing doors and integrated LED lighting. Highlight your awards or products on the adjustable shelves. Available in Black or Gray.",
    "dimensions": "L80cm x W35cm x H100cm",
    "price": 7580.00,
    "category": "Cabinet & Storage",
    "image": getImg("WLS-041", "Cabinet & Storage", "METAL DISPLAY CABINET"),
    "stock": 10
  },
  {
    "id": "WLS-042",
    "sku": "WLS-042",
    "name": "METAL DISPLAY CABINET (Variant)",
    "description": "Tall version of the WLS-041 display cabinet. Features LED lighting and full-height glass doors to showcase items elegantly. A stylish addition to reception areas.",
    "dimensions": "L80cm x W35cm x H180cm",
    "price": 12535.00,
    "category": "Cabinet & Storage",
    "image": getImg("WLS-042", "Cabinet & Storage", "METAL DISPLAY CABINET"),
    "stock": 10
  },
  {
    "id": "WLS-040 (HX-W052ZY)",
    "sku": "WLS-040 (HX-W052ZY)",
    "name": "METAL CABINET",
    "description": "Premium metal cabinet with a wood grain finish. Combines the durability of steel with the aesthetic of wood. Features swing doors and 4 adjustable shelves.",
    "dimensions": "L90cm x W42cm x H185cm",
    "price": 10835.00,
    "category": "Cabinet & Storage",
    "image": getImg("WLS-040", "Cabinet & Storage", "METAL CABINET"),
    "stock": 10
  },
  {
    "id": "WLS-039 (HX-W055ZY)",
    "sku": "WLS-039 (HX-W055ZY)",
    "name": "METAL CABINET",
    "description": "Wood grain finished metal cabinet with 2 external pull-out drawers. Offers a mix of concealed shelf storage and accessible drawer space. Stylish and tough.",
    "dimensions": "Standard Size",
    "price": 10835.00,
    "category": "Cabinet & Storage",
    "image": getImg("WLS-039", "Cabinet & Storage", "METAL CABINET"),
    "stock": 10
  }
];