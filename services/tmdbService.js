const axios = require("axios");

const BASE_URL = process.env.TMDB_BASE_URL;

const tmdbApi = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.TMDB_READ_TOKEN}`,
        "Content-Type": "application/json"
    }
});

/**
 * TMDb'den film arama
 */
exports.searchMovie = async (query, page = 1) => {
    try {
        const { data } = await tmdbApi.get("/search/movie", {
            params: {
                query,
                page,
                language: "tr-TR",
                include_adult: false
            }
        });

        return data.results.map(normalizeMovieSummary);
    } catch (error) {
        console.error("Error searching movie in TMDB:", error.message);
        throw error;
    }
};

/**
 * TMDb'den film detay
 */
exports.getMovieDetails = async (id) => {
    try {
        const { data } = await tmdbApi.get(`/movie/${id}`, {
            params: { language: "tr-TR" }
        });

        if (!data || !data.id) {
            throw new Error("Movie not found in TMDB");
        }

        return normalizeMovieDetail(data);

    } catch (error) {
        console.error("TMDB getMovieDetails error:", error.response?.data || error.message);

        if (error.response?.status === 404) {
            throw new Error("Movie not found");
        }

        throw new Error("Failed to fetch movie details");
    }
};

exports.getPopularMovies = async (page = 1) => {
    const { data } = await tmdbApi.get("/movie/popular", {
        params: {
            page,
            language: "tr-TR"
        }
    });

    return {
        page: data.page,
        totalPages: data.total_pages,
        results: data.results.map(normalizeMovieSummary)
    };
};

exports.getNowPlayingMovies = async (page = 1) => {
    const { data } = await tmdbApi.get("/movie/now_playing", {
        params: {
            page,
            language: "tr-TR"
        }
    });

    return {
        page: data.page,
        totalPages: data.total_pages,
        results: data.results.map(normalizeMovieSummary)
    };
};

exports.getMoviesByGenre = async (genreId, page = 1) => {
    const { data } = await tmdbApi.get("/discover/movie", {
        params: {
            with_genres: genreId,
            sort_by: "popularity.desc",
            page,
            language: "tr-TR",
            include_adult: false
        }
    });

    return {
        page: data.page,
        totalPages: data.total_pages,
        results: data.results.map(normalizeMovieSummary)
    };
};

exports.getMovieImages = async (id) => {
    try {
        const { data } = await tmdbApi.get(`/movie/${id}/images`, {
            params: {
                include_image_language: "tr,en,null" // Get logos in TR, EN or no language
            }
        });

        return {
            logos: data.logos.map(img => ({
                filePath: buildImageUrl(img.file_path, "w500"),
                width: img.width,
                height: img.height,
                aspectRatio: img.aspect_ratio,
                lang: img.iso_639_1
            }))
        };
    } catch (error) {
        console.error(`Error getting movie images for ID ${id}:`, error.message);
        return { logos: [] }; // Return empty if failed, don't break
    }
};


exports.getTvDetails = async (id) => {
    try {
        const { data } = await tmdbApi.get(`/tv/${id}`, {
            params: { language: "tr-TR" }
        });

        if (!data || !data.id) {
            throw new Error("TV Series not found in TMDB");
        }

        return normalizeTvDetail(data);

    } catch (error) {
        console.error("TMDB getTvDetails error:", error.response?.data || error.message);

        if (error.response?.status === 404) {
            throw new Error("TV Series not found");
        }

        throw new Error("Failed to fetch TV series details");
    }
};

exports.getPopularSeries = async (page = 1) => {
    const { data } = await tmdbApi.get("/tv/popular", {
        params: {
            page,
            language: "tr-TR"
        }
    });

    return {
        page: data.page,
        totalPages: data.total_pages,
        results: data.results.map(normalizeTvSummary)
    };
};

exports.getTvByGenre = async (genreId, page = 1) => {
    try {
        console.log("TV GENRE:", genreId);

        const { data } = await tmdbApi.get("/discover/tv", {
            params: {
                with_genres: genreId,
                sort_by: "popularity.desc",
                page,
                language: "tr-TR",
                include_adult: false
            }
        });

        console.log("TMDB TV RESPONSE OK");

        return {
            page: data.page,
            totalPages: data.total_pages,
            results: data.results.map(normalizeTvSummary)
        };

    } catch (error) {
        console.error("TV DISCOVER ERROR:", error.response?.data || error.message);
        throw error;
    }
};


exports.getSeriesImages = async (id) => {
    try {
        const { data } = await tmdbApi.get(`/tv/${id}/images`, {
            params: {
                include_image_language: "tr,en,null" // Get logos in TR, EN or no language
            }
        });

        return {
            logos: data.logos.map(img => ({
                filePath: buildImageUrl(img.file_path, "w500"),
                width: img.width,
                height: img.height,
                aspectRatio: img.aspect_ratio,
                lang: img.iso_639_1
            }))
        };
    } catch (error) {
        console.error(`Error getting series images for ID ${id}:`, error.message);
        return { logos: [] }; // Return empty if failed, don't break
    }
};

exports.getMovieReviews = async (id, page = 1) => {
    try {
        const { data } = await tmdbApi.get(`/movie/${id}/reviews`, {
            params: { page, language: "en-US" } // Reviews are usually richer in English, TMDB fallback handles it mostly
        });
        return {
            page: data.page,
            totalPages: data.total_pages,
            results: data.results.map(normalizeReview)
        };
    } catch (error) {
        console.error(`Error getting movie reviews for ID ${id}:`, error.message);
        return { page: 1, totalPages: 1, results: [] };
    }
};

exports.getTvReviews = async (id, page = 1) => {
    try {
        const { data } = await tmdbApi.get(`/tv/${id}/reviews`, {
            params: { page, language: "en-US" }
        });
        return {
            page: data.page,
            totalPages: data.total_pages,
            results: data.results.map(normalizeReview)
        };
    } catch (error) {
        console.error(`Error getting TV reviews for ID ${id}:`, error.message);
        return { page: 1, totalPages: 1, results: [] };
    }
};

function normalizeMovieSummary(movie) {
    return {
        externalId: movie.id,
        type: "movie",
        title: movie.title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        posterUrl: buildImageUrl(movie.poster_path, "w500"),
        backdropUrl: buildImageUrl(movie.backdrop_path, "w780"),
        tmdbVoteAverage: movie.vote_average,
        tmdbVoteCount: movie.vote_count,
        tmdbPopularity: movie.popularity
    };
}

function normalizeMovieDetail(movie) {
    return {
        externalId: movie.id,
        source: "tmdb",
        type: "movie",

        title: movie.title,
        originalTitle: movie.original_title,
        overview: movie.overview,
        releaseDate: movie.release_date,
        runtime: movie.runtime || null,

        genres: movie.genres?.map(g => g.name) || [],

        posterUrl: buildImageUrl(movie.poster_path, "w500"),
        backdropUrl: buildImageUrl(movie.backdrop_path, "w1280"),

        tmdbVoteAverage: movie.vote_average || 0,
        tmdbVoteCount: movie.vote_count || 0,
        tmdbPopularity: movie.popularity || 0,

        lastSyncedAt: new Date()
    };
}

function buildImageUrl(path, size = "w500") {
    if (!path) return null;
    return `${process.env.TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

function normalizeTvSummary(tv) {
    return {
        externalId: tv.id,
        type: "tv",
        title: tv.name,
        overview: tv.overview,
        releaseDate: tv.first_air_date,
        posterUrl: buildImageUrl(tv.poster_path, "w500"),
        backdropUrl: buildImageUrl(tv.backdrop_path, "w780"),
        tmdbVoteAverage: tv.vote_average,
        tmdbVoteCount: tv.vote_count,
        tmdbPopularity: tv.popularity
    };
}

function normalizeTvDetail(tv) {
    return {
        externalId: tv.id,
        source: "tmdb",
        type: "tv",

        title: tv.name,
        originalTitle: tv.original_name,
        overview: tv.overview,
        releaseDate: tv.first_air_date,
        lastAirDate: tv.last_air_date,
        status: tv.status,

        seasons: tv.number_of_seasons,
        episodes: tv.number_of_episodes,
        duration: tv.episode_run_time?.[0] ? `${tv.episode_run_time[0]} dk` : null,

        genres: tv.genres?.map(g => g.name) || [],

        posterUrl: buildImageUrl(tv.poster_path, "w500"),
        backdropUrl: buildImageUrl(tv.backdrop_path, "w1280"),

        tmdbVoteAverage: tv.vote_average || 0,
        tmdbVoteCount: tv.vote_count || 0,
        tmdbPopularity: tv.popularity || 0,

        creators: tv.created_by?.map(c => c.name) || [],
        networks: tv.networks?.map(n => n.name) || [],

        lastSyncedAt: new Date()
    };
}

function normalizeReview(review) {
    return {
        id: review.id,
        author: review.author,
        username: review.author_details?.username,
        avatarPath: buildImageUrl(review.author_details?.avatar_path, "w185"),
        rating: review.author_details?.rating || null,
        content: review.content,
        createdAt: review.created_at,
        url: review.url
    };
}

