const { Pool } = require("pg");

class PlaylistService {
    constructor() {
        this._pool = new Pool();
    }

    async getPlaylistWithSongs(id) {
        const query = {
            text: `SELECT
            p.id as playlist_id,
            p.name as playlist_name,
            u.username as username,
            s.id as song_id,
            s.title as song_title,
            s.performer as song_performer
          FROM
              playlist_songs ps
          LEFT JOIN
              songs s ON ps."songId" = s.id
          LEFT JOIN
              playlists p ON ps."playlistId" =  p.id
          LEFT JOIN
              users u ON p.owner =  u.id
          WHERE
              ps."playlistId" = $1
        `,
            values: [id],
        };

        const result = await this._pool.query(query);

        const newDataSongs =
            result.rows[0].song_id !== null
                ? await result.rows.map((e) => {
                      const newObjSong = {
                          id: e.song_id,
                          title: e.song_title,
                          performer: e.song_performer,
                      };
                      return newObjSong;
                  })
                : [];

        const data = {
            playlist: {
                id: result.rows[0].playlist_id,
                name: result.rows[0].playlist_name,
                songs: newDataSongs,
            },
        };

        return data;
    }
}

module.exports = PlaylistService;
