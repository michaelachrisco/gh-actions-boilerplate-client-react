import { FC } from 'react';
import { User, Thumbnail } from 'common/models';
import portraitPlaceholder from 'assets/img/portrait_placeholder.png';

type Props = {
    user: User | null;
    size: string;
    radius: number;
};

export const UserProfileImage: FC<Props> = ({ user, size, radius }) => {

    let imageSource = '';
    const fullName = user ? `${user.firstName} ${user.lastName}` : 'User';

    if (user && user.profilePicture) {
        const assocThumbnails = user.profilePicture.thumbnails.filter((thumbnail: Thumbnail) => thumbnail.size === size);
        if (assocThumbnails.length !== 0) {
            imageSource = assocThumbnails[0].file.url;
        } else {
            imageSource = user.profilePicture.file.url;
        }
    } else {
        imageSource = portraitPlaceholder;
    }

    return (
        <img className='rounded-circle' style={{ marginRight: '.75rem', height: radius, width: radius }} src={imageSource} alt={fullName} />
    )
};