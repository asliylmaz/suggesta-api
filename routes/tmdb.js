const express = require("express");
const router = express.Router();
const tmdbService = require("../services/tmdbService");

/**
 * GET /api/tmdb/search/movie?q=...
 */
router.get("/search/movie", async (req, res, next) => {
    try {
        const { q, page } = req.query;

        if (!q) {
            return res.status(400).json({
                message: "Query parameter 'q' is required"
            });
        }

        const results = await tmdbService.searchMovie(q, page);

        res.json({
            page: Number(page) || 1,
            resultsCount: results.length,
            results
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/tmdb/movie/popular?page=1
 */
router.get("/movie/popular", async (req, res, next) => {
    try {
        const { page } = req.query;
        const data = await tmdbService.getPopularMovies(page);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/tmdb/movie/now-playing?page=1
 */
router.get("/movie/now-playing", async (req, res, next) => {
    try {
        const { page } = req.query;
        const data = await tmdbService.getNowPlayingMovies(page);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get("/movie/discover", async (req, res, next) => {
    try {
        const { with_genres, page } = req.query;
        const data = await tmdbService.getMoviesByGenre(with_genres, page);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/tmdb/movie/:id
 */
router.get("/movie/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        const movie = await tmdbService.getMovieDetails(id);

        res.json(movie);
    } catch (error) {
        next(error);
    }
});

router.get("/movie/:id/images", async (req, res, next) => {
    try {
        const { id } = req.params;
        const images = await tmdbService.getMovieImages(id);
        res.json(images);
    } catch (error) {
        next(error);
    }
});

router.get("/movie/:id/reviews", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page } = req.query;
        const reviews = await tmdbService.getMovieReviews(id, page);
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});

router.get("/tv/discover", async (req, res, next) => {
    try {
        const { with_genres, page } = req.query;
        const data = await tmdbService.getTvByGenre(with_genres, page);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get("/tv/popular", async (req, res, next) => {
    try {
        const { page } = req.query;
        const data = await tmdbService.getPopularSeries(page);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

router.get("/tv/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const tv = await tmdbService.getTvDetails(id);
        res.json(tv);
    } catch (error) {
        next(error);
    }
});

router.get("/tv/:id/images", async (req, res, next) => {
    try {
        const { id } = req.params;
        const images = await tmdbService.getSeriesImages(id);
        res.json(images);
    } catch (error) {
        next(error);
    }
});

router.get("/tv/:id/reviews", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { page } = req.query;
        const reviews = await tmdbService.getTvReviews(id, page);
        res.json(reviews);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
