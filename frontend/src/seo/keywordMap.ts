/**
 * Keyword map — one primary intent per indexable template.
 * Validated against public GB/pharmacy search language; volumes are directional.
 */
export const keywordMap = {
  home: { primary: 'medical store in Gilgit', secondary: ['pharmacy Gilgit', 'medical store Gilgit-Baltistan'] },
  medicines: { primary: 'medicines in Gilgit', secondary: ['pharmacy Gilgit-Baltistan'] },
  surgical: { primary: 'surgical equipment Gilgit', secondary: ['medical equipment Gilgit'] },
  medicalEquipment: { primary: 'medical equipment Gilgit-Baltistan', secondary: ['home healthcare Gilgit'] },
  cosmetics: { primary: 'cosmetics store Gilgit', secondary: ['skin care products Gilgit'] },
  delivery: { primary: 'medicine delivery Gilgit', secondary: ['pharmacy delivery Gilgit-Baltistan'] },
  prescription: { primary: 'upload prescription Gilgit pharmacy', secondary: [] },
  blog: { primary: 'health guides Gilgit', secondary: ['first aid products', 'vitamins and supplements'] },
};
