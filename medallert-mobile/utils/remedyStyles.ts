import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 18,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backBtn: {
        paddingRight: 10,
        paddingVertical: 6,
    },
    backText: {
        color: '#1a1a1a',
    },
    title: {
        flex: 1,
        fontSize: 32,
        fontWeight: '800',
    },
    profileBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: 'hidden',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 8,
    },
    addRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    input: {
        flex: 1,
        height: 54,
        backgroundColor: '#fff',
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    addBtn: {
        marginLeft: 10,
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plus: {
        fontSize: 22,
        fontWeight: '700',
    },
    list: {
        paddingBottom: 40,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 12,
        marginBottom: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#000',
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    medName: {
        fontSize: 16,
        fontWeight: '600',
    },
    metaIcon: {
        fontSize: 20,
    },
    chev: {
        fontSize: 22,
        color: '#9ca3af',
        marginLeft: 8,
    },
});
