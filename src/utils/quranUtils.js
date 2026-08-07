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
