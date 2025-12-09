import { Alert, Share } from 'react-native';

const shareArticle = async (articleLink: string) => {
    try {
        const result = await Share.share({
            message: articleLink,
            title: 'An uplifting story you need to see!',
            url: articleLink,
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                console.log(`Shared successfully via: ${result.activityType}`);
            } else {
                console.log('Shared successfully');
            }
        } else if (result.action === Share.dismissedAction) {
            console.log('Share dismissed');
        }
    } catch (error: any) {
        Alert.alert(error.message);
    }
};

export default shareArticle;