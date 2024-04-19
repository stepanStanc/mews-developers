import { useQuery } from '@tanstack/react-query';
import { ReactQueryPrimaryKey } from '../../enums/reactQueryPrimaryKey.ts';
import { getMovieDetail } from '../../api/tmdbApi.ts';
import { Link, useParams } from 'react-router-dom';
import {
    ClosingBackdropImage,
    MovieDetailIntro,
    MovieDetailIntroBody,
    MoviePosterImage
} from './MovieDetail.styled.tsx';
import { BackdropImageSize } from '../../enums/images/backdropImageSize.ts';
import { Button } from '../shared/Button.tsx';
import { Spacer } from '../../enums/style/spacer.ts';
import { PosterImageSize } from '../../enums/images/posterImageSize.ts';
import { MovieCastList } from '../MovieCastList.tsx';
import { BsClock } from 'react-icons/bs';
import { displayRatings, displayRuntime } from '../../utils/movieUtils.ts';

export function MovieDetail() {
    const { movieId } = useParams();
    const enabled = !!movieId;
    const { data, isError, isPending } = useQuery({
        queryKey: [ReactQueryPrimaryKey.TmdbMovieDetail, movieId],
        queryFn: () => getMovieDetail(Number(movieId)),
        enabled
    });

    if (!enabled) {
        return (<span>Movie not found</span>);
    }

    if (isPending) {
        return (<span>Loading</span>);
    }

    if (isError) {
        return (
            <span>Failed to load data, please reload this page or came back later</span>
        );
    }

    const {
        title,
        overview,
        releaseDate,
        getBackdropUrl,
        getPosterUrl,
        genres,
        tagline,
        runtime,
        imbdId,
        id,
        voteAverage,
        voteCount
    } = data;

    // TODO: remove
    console.log(data);

    // TODO
    /*
    * show
    * - vote avg & vote count; use icons
    * - poster, to the left of the image
    * - runtime
    * - link to TMDB & IMBD
    * */

    const backdropUrl = getBackdropUrl(BackdropImageSize.Width1280);
    const posterUrl = getPosterUrl(PosterImageSize.Width500);

    const genresSummary = (
        genres && genres.length > 0 &&
        <><span>{genres.map(g => g.name).join(', ')}</span><br/></>
    );

    // TODO: the year can be missing
    // TODO: runtime can be 0
    // TODO: there can be no ratings
    return (
        <>
            <MovieDetailIntro>
                {posterUrl && <MoviePosterImage alt="" src={posterUrl} />}
                <MovieDetailIntroBody>
                    <h2>{title} <i>({releaseDate.getFullYear()})</i></h2>
                    {tagline && <blockquote>{tagline}</blockquote>}
                    {genresSummary}
                    {runtime > 0 && <><span><BsClock/> {displayRuntime(runtime)}</span><br/></>}
                    <i>{displayRatings(voteAverage, voteCount)}</i>
                    {overview && <p>{overview}</p>}
                    <p>
                        <Button as="a" href={`https://www.themoviedb.org/movie/${id}`} title="See on TMDB">TMBD</Button>
                        {imbdId && <Button as="a" href={`https://www.imdb.com/title/${imbdId}`}
                                           title="See on IMDB">IMBD</Button>}
                    </p>
                </MovieDetailIntroBody>
            </MovieDetailIntro>

            <MovieCastList movieId={Number(movieId)}/>

            {backdropUrl && <ClosingBackdropImage alt="" src={backdropUrl}/>}

            <Button
                as={Link}
                to={-1}
                style={{marginTop: Spacer.Lg}}
            >
                Back to search
            </Button>
        </>
    );
}

