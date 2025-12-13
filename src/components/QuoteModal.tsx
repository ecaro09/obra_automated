import React, { useState } from 'react';
import { X, Trash2, Printer, Plus, Minus, User, MapPin, Phone, Mail, Ruler, FileText, Download } from 'lucide-react';
import { CartItem } from '@/types';
import { getImageUrl } from '@/utils/imageUtils';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQty: (id: string, delta: number) => void;
  remove: (id: string) => void;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, cart, updateQty, remove }) => {
  const [clientDetails, setClientDetails] = useState({
    name: '',
    address: '',
    email: '',
    phone: ''
  });
  
  const [financials, setFinancials] = useState({
    discount: 0,
    delivery: 0
  });

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
  const grandTotal = Math.max(0, subtotal + financials.delivery - financials.discount);

  const handlePrint = () => {
    window.print();
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setClientDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFinancials(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-0 pt-4 pb-20 text-center sm:block sm:p-0">
        
        {/* Overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75 print:hidden" 
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        {/* Modal Panel */}
        <div 
          className="inline-block w-full max-w-5xl text-left align-bottom transition-all transform bg-white rounded-t-2xl sm:rounded-2xl shadow-xl sm:my-8 sm:align-middle overflow-hidden h-[90vh] sm:h-auto flex flex-col" 
          id="printable-section"
        >
          
          {/* Screen Header (Hidden on Print) */}
          <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 no-print">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">Quotation Preview</h3>
              <p className="text-xs sm:text-sm text-slate-500">Review details before printing.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-grow p-4 sm:p-8 bg-white print:p-0 print:overflow-visible">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-6 sm:mb-8 pb-6 sm:pb-8 border-b-2 border-teal-600">
              <div className="mb-6 md:mb-0 w-full md:w-auto">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">OBRA FURNITURE</h1>
                <p className="text-slate-600 font-medium mt-1">Professional Furniture Solutions</p>
                <div className="mt-4 text-xs sm:text-sm text-slate-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    12 Santan St. Quezon City, Metro Manila Philippines 1116
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    obrafurniture@gmail.com
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    (Viber) +63 915 743 9188
                  </div>
                </div>
              </div>
              <div className="text-left md:text-right w-full md:w-auto bg-slate-50 p-4 rounded-lg print:bg-transparent print:p-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 uppercase tracking-widest text-teal-700">Quotation</h2>
                <p className="text-sm font-semibold text-slate-600 mt-1">#{Math.floor(Date.now() / 1000)}</p>
                <p className="text-sm text-slate-500 mt-1">{currentDate}</p>
              </div>
            </div>

            {/* Client Details Form */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-xl border border-slate-100 mb-8 print:bg-transparent print:border-none print<dyad-problem-report summary="17 problems">
<problem file="src/components/ProductCatalogSection.tsx" line="5" column="40" code="2307">Cannot find module '@/components/ProductSearchAndFilter' or its corresponding type declarations.</problem>
<problem file="src/components/ProductCatalogSection.tsx" line="6" column="29" code="2307">Cannot find module '@/components/ProductGrid' or its corresponding type declarations.</problem>
<problem file="src/hooks/useProducts.ts" line="4" column="37" code="2307">Cannot find module '@/utils/pricingUtils' or its corresponding type declarations.</problem>
<problem file="src/hooks/useCart.ts" line="3" column="37" code="2307">Cannot find module '@/utils/pricingUtils' or its corresponding type declarations.</problem>
<problem file="src/App.tsx" line="4" column="39" code="2307">Cannot find module '@/components/ProductCatalogSection' or its corresponding type declarations.</problem>
<problem file="src/App.tsx" line="5" column="30" code="2307">Cannot find module '@/components/ModalManager' or its corresponding type declarations.</problem>
<problem file="src/App.tsx" line="6" column="29" code="2307">Cannot find module '@/hooks/useProducts' or its corresponding type declarations.</problem>
<problem file="src/App.tsx" line="7" column="25" code="2307">Cannot find module '@/hooks/useCart' or its corresponding type declarations.</problem>
<problem file="src/App.tsx" line="8" column="31" code="2307">Cannot find module '@/hooks/useComparison' or its corresponding type declarations.</problem>
<problem file="src/App.tsx" line="9" column="36" code="2307">Cannot find module '@/hooks/useSearchAndFilter' or its corresponding type declarations.</problem>
<problem file="src/App.tsx" line="10" column="41" code="2307">Cannot find module '@/hooks/useBatchImageGeneration' or its corresponding type declarations.</problem>
<problem file="src/constants.ts" line="2" column="38" code="2307">Cannot find module '@/utils/imageGenerationUtils' or its corresponding type declarations.</problem>
<problem file="src/components/AddProductModal.tsx" line="5" column="34" code="2307">Cannot find module '@/components/ImageInputWithAI' or its corresponding type declarations.</problem>
<problem file="src/components/ComparisonModal.tsx" line="4" column="37" code="2307">Cannot find module '@/utils/pricingUtils' or its corresponding type declarations.</problem>
<problem file="src/components/ProductCard.tsx" line="4" column="37" code="2307">Cannot find module '@/utils/pricingUtils' or its corresponding type declarations.</problem>
<problem file="src/components/ProductDetailsModal.tsx" line="4" column="37" code="2307">Cannot find module '@/utils/pricingUtils' or its corresponding type declarations.</problem>
<problem file="src/services/gemini.ts" line="2" column="37" code="2307">Cannot find module '@/utils/pricingUtils' or its corresponding type declarations.</problem>
</dyad-problem-report><think>**Diagnosing the Module Issue**

I've been meticulously examining the 17 TypeScript compile-time errors, all pointing to `TS 2307: Cannot find module`. I've already updated `vite.config.ts` to implement the `@` alias, aiming to resolve the module resolution problem. I'm now exploring the project structure and dependencies to pinpoint the root cause, considering potential pathing inconsistencies or missing imports.


**Refining Module Resolution**

I'm now revisiting the `@` alias configuration in `vite.config.ts`. Although I initially set it to map to the `src` directory, the errors persist, suggesting the resolution might still be flawed. The problem seems to be the import paths themselves, as files like `src/services/gemini.ts` are attempting to import using `@/` paths that aren't matching the intended structure. I'm carefully re-examining how imports are being written and the paths they are pointing to. It looks like the import paths are relative to the project root, rather than the `src` folder.


**Resolving Alias Mismatch**

I've determined that the issue stems from a mismatch between the Vite alias and TypeScript's understanding of the import paths. The `vite.config.ts` alias is correctly defined. However, without a corresponding configuration in `tsconfig.json`, TypeScript doesn't recognize the `@` alias during compilation. My next step involves creating or updating `tsconfig.json` to include a `paths` configuration that aligns with the Vite alias, thereby ensuring that TypeScript resolves the module paths correctly.


**Refining Alias Implementation**

My current focus is on the discrepancy between the Vite alias and TypeScript's understanding of import paths. Though the Vite alias is correctly defined in `vite.config.ts`, TypeScript doesn't recognize it during compilation. I suspect the missing piece is a corresponding configuration in `tsconfig.json`. I'm now drafting the `tsconfig.json` file with a `paths` configuration that mirrors the Vite alias, which should resolve the module import errors.


**Addressing TypeScript's Discrepancy**

It seems that the `@` alias I established in `vite.config.ts` isn't being recognized by TypeScript during compilation, which is causing the module resolution errors to persist. I've re-examined the project structure and dependencies, noting that my `vite.config.ts` is configured to correctly map `@` to the `src` directory. To resolve the discrepancy, I'm now focusing on configuring the TypeScript compiler to properly interpret this alias. I'm considering integrating a `tsconfig.json` to configure the `@/*` alias to  `./src/*`, making sure the compiler understands the intended module resolution behavior.

**Fixing TypeScript's Alias Resolution**

I've determined that, while Vite correctly resolves the `@` alias to the `src` directory, TypeScript isn't interpreting it during compilation. To fix this, I'm integrating a `tsconfig.json` file with a `paths` configuration that mirrors the Vite alias. This should synchronize the module resolution between the build and compile steps, eliminating the `TS2307` errors. I will add a tsconfig.json to the repository, to ensure the module resolution between the build and compile steps are synchronized.


**Fixing TypeScript's Alias Resolution**

I've determined that, while Vite correctly resolves the `@` alias to the `src` directory, TypeScript isn't interpreting it during compilation. To fix this, I'm integrating a `tsconfig.json` file with a `paths` configuration that mirrors the Vite alias. This should synchronize the module resolution between the build and compile steps, eliminating the `TS2307` errors. I will add a tsconfig.json to the repository, to ensure the module resolution between the build and compile steps are synchronized.


**Synchronizing Alias Configuration**

I'm focusing on ensuring that the `tsconfig.json` file is correctly configured to recognize the `@` alias established in `vite.config.ts`. Although Vite resolves it, TypeScript needs explicit instructions through the `paths` configuration. I'm now implementing the `tsconfig.json` file, with the correct `paths` entry, to rectify the `TS2307` errors.


**Updating Alias Resolution**

I've crafted `tsconfig.json` and `tsconfig.node.json` to configure TypeScript's alias resolution. The `paths` settings are now properly set, mirroring Vite's alias for consistent module resolution. I'm hopeful this resolves the `TS2307` errors.


**Finalizing Module Integration**

I'm now fully confident that the `tsconfig.json` and `tsconfig.node.json` files I've crafted, which include the necessary `paths` configuration to mirror the Vite alias, are the complete solution. I'm hoping this will completely eradicate the `TS2307` errors.


</think>It looks like the TypeScript compiler isn't correctly resolving the path aliases (`@/`) that are configured in your `vite.config.ts`. This is typically fixed by adding a `paths` configuration to your `tsconfig.json` file, which tells TypeScript how to map these aliases.

I'll create a `tsconfig.json` and `tsconfig.node.json` with the necessary path mapping.

<dyad-write path="tsconfig.json" description="Configuring TypeScript to resolve path aliases for the application code.">
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.d.ts", "index.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}