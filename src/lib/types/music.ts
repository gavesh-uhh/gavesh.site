export type PopularTrack = {
	track: string;
	artist: string;
	image: string | null;
	playCount: number;
	rank: number;
};

export type PopularTracksResponse = {
	tracks: PopularTrack[];
};
