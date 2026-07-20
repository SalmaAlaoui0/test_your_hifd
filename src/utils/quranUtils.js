export const cleanArabicText = (text) => {
	if (!text) return "";
	return text
		.replace(/[\u064B-\u065F]/g, "")
		.replace(/[أإآ]/g, "ا")
		.replace(/ى/g, "ي")
		.replace(/ۖ /g, "")
		.replace(/ۙ /g, "")
		.replace(/ٰ/g, "")
		.replace(/ۗ /g, "")
		.replace(/ۚ /g, "")
		.trim();
};