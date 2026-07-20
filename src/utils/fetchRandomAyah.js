export const fetchRandomAyah = async ({
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

		setCurrentAyah({
			text: selected.text,
			numberInSurah: selected.numberInSurah,
			surahName: selected.surah.name,
			surahNumber: selected.surah.number,
		});
		console.log('selected surah number is: ', selected.surah.number);
		console.log('selected surah name is: ', selected.surah.name);
		// console.log('selected Ayah number is: ', selected.numberInSurah);
		// console.log('selected Surah Name is: ', selected.surah.name);
	} catch (error) {
	console.error('error fetching the random Ayah: ', error)
	}
	setLoding(false);
};