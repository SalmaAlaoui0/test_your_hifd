export const cleanArabicText = (text) => {
	if (!text) return "";
	return text
		.replace(/[\u064B-\u065F]/g, "")
		.replace(/[أإآ]/g, "ا")
		.replace(/ى/g, "ي")
		.replace(/ۖ /g, " ")
		.replace(/ۙ /g, "")
		.replace(/ٰ/g, "")
		.replace(/ۗ /g, "")
		.replace(/ۚ /g, "")
		.replace(/مۡۗ/g, "")
		.replace(/۞/g, "")
		.replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, "")
		.trim();
};

// export const cleanArabicText = (text) => {
//     if (!text) return "";
//     return text
//         // 1. Remove all Arabic diacritics & Quranic honorifics/marks (Unicode ranges \u0610-\u061A, \u064B-\u065F, \u06D6-\u06DC, \u06DF-\u06E8, \u06EA-\u06ED)
//         .replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, "")
//         // 2. Normalize Alif Wasla (ٱ) and all Hamza forms (أ, إ, آ) to plain Alif (ا)
//         .replace(/[أإآٱ]/g, "ا")
//         // 3. Normalize Alif Maqsura (ى) to Ya (ي)
//         .replace(/ى/g, "ي")
//         // 4. Remove lingering Quranic Alif Khanjariyah / superscript Alif
//         .replace(/ٰ/g, "")
//         // 5. Replace multiple spaces with a single space and trim
//         .replace(/\s+/g, " ")
//         .trim();
// };

// export const cleanArabicText = (text) => {
//     if (!text) return "";
//     return text
//         // إزالة الحركات والتشكيل والتنوين والعلامات العثمانية
//         .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/g, "")
//         // توحيد جميع أشكال الهمزات والألف والألف المقصورة
//         .replace(/[أإآٱٲٳ]/g, "ا")
//         .replace(/ى/g, "ي")
//         .replace(/ؤ/g, "و")
//         .replace(/ئ/g, "ي")
//         .replace(/ة/g, "ه")
//         // تحويل الرسم العثماني الشهير للرسم القياسي لضبط مطابقة التسميع
//         .replace(/\bالكتب\b/g, "الكتاب")
//         .replace(/\bالكتاب\b/g, "الكتاب")
//         .replace(/\bصلوه\b/g, "صلاه")
//         .replace(/\bالصلوه\b/g, "الصلاه")
//         .replace(/\bزكوه\b/g, "زكاه")
//         .replace(/\bالزكوه\b/g, "الزكاه")
//         .replace(/\bحيوہ\b/g, "حياه")
//         .replace(/\bالحيوہ\b/g, "الحياه")
//         .replace(/\bالربوا\b/g, "الربا")
//         // إزالة أي رموز أو علامات ترقيم أو فواصل
//         .replace(/[^\w\sء-ي]/gi, "")
//         .trim();
// };