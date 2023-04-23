import z from 'zod';

const sortOrderValues = ['ASC', 'DESC'] as const;

const paginationParameters = z.object({
  _end: z.number().optional(),
  _order: z.enum(sortOrderValues),
  _start: z.number().optional(),
});

const authenticate = z.object({
  id: z.string(),
  isAdmin: z.boolean(),
  name: z.string(),
  subsonicSalt: z.string(),
  subsonicToken: z.string(),
  token: z.string(),
  username: z.string(),
});

const authenticateParameters = z.object({
  password: z.string(),
  username: z.string(),
});

const user = z.object({
  createdAt: z.string(),
  email: z.string().optional(),
  id: z.string(),
  isAdmin: z.boolean(),
  lastAccessAt: z.string(),
  lastLoginAt: z.string(),
  name: z.string(),
  updatedAt: z.string(),
  userName: z.string(),
});

const userList = z.array(user);

const genre = z.object({
  id: z.string(),
  name: z.string(),
});

const genreList = z.array(genre);

const albumArtist = z.object({
  albumCount: z.number(),
  biography: z.string(),
  externalInfoUpdatedAt: z.string(),
  externalUrl: z.string(),
  fullText: z.string(),
  genres: z.array(genre),
  id: z.string(),
  largeImageUrl: z.string().optional(),
  mbzArtistId: z.string().optional(),
  mediumImageUrl: z.string().optional(),
  name: z.string(),
  orderArtistName: z.string(),
  playCount: z.number(),
  playDate: z.string(),
  rating: z.number(),
  size: z.number(),
  smallImageUrl: z.string().optional(),
  songCount: z.number(),
  starred: z.boolean(),
  starredAt: z.string(),
});

const albumArtistList = z.array(albumArtist);

const ndAlbumArtistListSort = {
  ALBUM_COUNT: 'albumCount',
  FAVORITED: 'starred ASC, starredAt ASC',
  NAME: 'name',
  PLAY_COUNT: 'playCount',
  RATING: 'rating',
  SONG_COUNT: 'songCount',
} as const;

const albumArtistListParameters = paginationParameters.extend({
  _sort: z.nativeEnum(ndAlbumArtistListSort).optional(),
  genre_id: z.string().optional(),
  name: z.string().optional(),
  starred: z.boolean().optional(),
});

const album = z.object({
  albumArtist: z.string(),
  albumArtistId: z.string(),
  allArtistIds: z.string(),
  artist: z.string(),
  artistId: z.string(),
  compilation: z.boolean(),
  coverArtId: z.string().optional(), // Removed after v0.48.0
  coverArtPath: z.string().optional(), // Removed after v0.48.0
  createdAt: z.string(),
  duration: z.number(),
  fullText: z.string(),
  genre: z.string(),
  genres: z.array(genre),
  id: z.string(),
  maxYear: z.number(),
  mbzAlbumArtistId: z.string().optional(),
  mbzAlbumId: z.string().optional(),
  minYear: z.number(),
  name: z.string(),
  orderAlbumArtistName: z.string(),
  orderAlbumName: z.string(),
  playCount: z.number(),
  playDate: z.string(),
  rating: z.number().optional(),
  size: z.number(),
  songCount: z.number(),
  sortAlbumArtistName: z.string(),
  sortArtistName: z.string(),
  starred: z.boolean(),
  starredAt: z.string().optional(),
  updatedAt: z.string(),
});

const albumList = z.array(album);

const ndAlbumListSort = {
  ALBUM_ARTIST: 'albumArtist',
  ARTIST: 'artist',
  DURATION: 'duration',
  NAME: 'name',
  PLAY_COUNT: 'playCount',
  PLAY_DATE: 'play_date',
  RANDOM: 'random',
  RATING: 'rating',
  RECENTLY_ADDED: 'recently_added',
  SONG_COUNT: 'songCount',
  STARRED: 'starred',
  YEAR: 'max_year',
} as const;

const albumListParameters = paginationParameters.extend({
  _sort: z.nativeEnum(ndAlbumListSort).optional(),
  album_id: z.string().optional(),
  artist_id: z.string().optional(),
  compilation: z.boolean().optional(),
  genre_id: z.string().optional(),
  has_rating: z.boolean().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  recently_added: z.boolean().optional(),
  starred: z.boolean().optional(),
  year: z.number().optional(),
});

const song = z.object({
  album: z.string(),
  albumArtist: z.string(),
  albumArtistId: z.string(),
  albumId: z.string(),
  artist: z.string(),
  artistId: z.string(),
  bitRate: z.number(),
  bookmarkPosition: z.number(),
  bpm: z.number().optional(),
  channels: z.number().optional(),
  comment: z.string().optional(),
  compilation: z.boolean(),
  createdAt: z.string(),
  discNumber: z.number(),
  duration: z.number(),
  fullText: z.string(),
  genre: z.string(),
  genres: z.array(genre),
  hasCoverArt: z.boolean(),
  id: z.string(),
  lyrics: z.string().optional(),
  mbzAlbumArtistId: z.string().optional(),
  mbzAlbumId: z.string().optional(),
  mbzArtistId: z.string().optional(),
  mbzTrackId: z.string().optional(),
  orderAlbumArtistName: z.string(),
  orderAlbumName: z.string(),
  orderArtistName: z.string(),
  orderTitle: z.string(),
  path: z.string(),
  playCount: z.number(),
  playDate: z.string(),
  rating: z.number().optional(),
  size: z.number(),
  sortAlbumArtistName: z.string(),
  sortArtistName: z.string(),
  starred: z.boolean(),
  starredAt: z.string().optional(),
  suffix: z.string(),
  title: z.string(),
  trackNumber: z.number(),
  updatedAt: z.string(),
  year: z.number(),
});

const songList = z.array(song);

const ndSongListSort = {
  ALBUM: 'album, order_album_artist_name, disc_number, track_number, title',
  ALBUM_ARTIST: 'order_album_artist_name, album, disc_number, track_number, title',
  ALBUM_SONGS: 'album, discNumber, trackNumber',
  ARTIST: 'artist',
  BPM: 'bpm',
  CHANNELS: 'channels',
  COMMENT: 'comment',
  DURATION: 'duration',
  FAVORITED: 'starred ASC, starredAt ASC',
  GENRE: 'genre',
  ID: 'id',
  PLAY_COUNT: 'playCount',
  PLAY_DATE: 'playDate',
  RATING: 'rating',
  RECENTLY_ADDED: 'createdAt',
  TITLE: 'title',
  TRACK: 'track',
  YEAR: 'year, album, discNumber, trackNumber',
};

const songListParameters = paginationParameters.extend({
  _sort: z.nativeEnum(ndSongListSort).optional(),
  album_id: z.string().optional(),
  artist_id: z.string().optional(),
  genre_id: z.string().optional(),
  starred: z.boolean().optional(),
});

const playlist = z.object({
  comment: z.string(),
  createdAt: z.string(),
  duration: z.number(),
  evaluatedAt: z.string(),
  id: z.string(),
  name: z.string(),
  ownerId: z.string(),
  ownerName: z.string(),
  path: z.string(),
  public: z.boolean(),
  rules: z.string(),
  size: z.number(),
  songCount: z.number(),
  sync: z.boolean(),
  updatedAt: z.string(),
});

const playlistList = z.array(playlist);

const playlistSong = playlist.extend({
  mediaFileId: z.string(),
  playlistId: z.string(),
});

const createPlaylist = playlist.pick({
  id: true,
});

const createPlaylistParameters = z.object({
  comment: z.string().optional(),
  name: z.string(),
  public: z.boolean().optional(),
  rules: z.record(z.any()).optional(),
  sync: z.boolean().optional(),
});

const updatePlaylist = playlist;

const updatePlaylistParameters = createPlaylistParameters.partial();

const deletePlaylist = z.null();

const addToPlaylist = z.object({
  added: z.number(),
});

const addToPlaylistParameters = z.object({
  ids: z.array(z.string()),
});

const removeFromPlaylist = z.object({
  ids: z.array(z.string()),
});

const removeFromPlaylistParameters = z.object({
  ids: z.array(z.string()),
});

export const ndType = {
  _parameters: {
    addToPlaylist: addToPlaylistParameters,
    albumArtistList: albumArtistListParameters,
    albumList: albumListParameters,
    authenticate: authenticateParameters,
    createPlaylist: createPlaylistParameters,
    removeFromPlaylist: removeFromPlaylistParameters,
    songList: songListParameters,
    updatePlaylist: updatePlaylistParameters,
  },
  _response: {
    addToPlaylist,
    album,
    albumArtist,
    albumArtistList,
    albumList,
    authenticate,
    createPlaylist,
    deletePlaylist,
    genre,
    genreList,
    playlist,
    playlistList,
    playlistSong,
    removeFromPlaylist,
    song,
    songList,
    updatePlaylist,
    user,
    userList,
  },
};