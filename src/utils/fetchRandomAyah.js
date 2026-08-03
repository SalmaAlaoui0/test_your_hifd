export const fetchRandomAyah = async ({
	setCurrentQuestionIndex,
	currentQuestionIndex,
	setRetryCounter,
	setUserTranscript,
	setIsCorrect,
	setLoding,
	setHasRecorded,
	setShowAnswerBox,
	fromHizb,
	toHizb,
	setCurrentAyah
}) => {
	setRetryCounter(0);
	setUserTranscript("");
	setIsCorrect(null);
	setLoding(true);
	setHasRecorded(false);
	setShowAnswerBox(false);
	try {
		setCurrentQuestionIndex(currentQuestionIndex + 1);
		const minHizb = parseInt(fromHizb);
		const maxHizb = parseInt(toHizb);
		const randomHizb = Math.floor(Math.random() * (maxHizb - minHizb + 1)) + minHizb;

		console.log('Random Hizb:', randomHizb);
		const juzNumber = Math.ceil(randomHizb / 2);
		
		const response = await fetch(`https://api.alquran.cloud/v1/juz/${juzNumber}/ar.warsh`);
		const data = await response.json();
		// console.log('Fetched data:', data);

		const allAyahs = data.data.ayahs;

		const hizbAyahs = allAyahs.filter(ayah => ayah.hizbQuarter >= (randomHizb - 1) * 4 + 1 && ayah.hizbQuarter <= randomHizb * 4);
		// console.log('Fetched Ayahs for Hizb:', hizbAyahs);

		const randomIndex = Math.floor(Math.random() * hizbAyahs.length);
		const selected = hizbAyahs[randomIndex];

		const cleanResponse = await fetch(
			`https://api.alquran.cloud/v1/ayah/${selected.surah.number}:${selected.numberInSurah}/editions/quran-warsh,quran-simple-clean`
		);
		const cleanData = await cleanResponse.json();

		const warshText = cleanData.data[0].text;
		const cleanText = cleanData.data[1].text;

        // Store both versions in currentAyah state object
        setCurrentAyah({
            text: warshText,
            cleanText: cleanText,
            numberInSurah: selected.numberInSurah,
            surahName: selected.surah.name,
            surahNumber: selected.surah.number,
        });
		// console.log('the clean text is: ', cleanText);
		// console.log('and wash with tashkeel text is: ', warshText);
	} catch (error) {
	console.error('error fetching the random Ayah: ', error)
	}
	setLoding(false);
};