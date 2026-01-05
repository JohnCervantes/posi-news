import TrendyModal from "@/components/TrendyModal";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@supabase/supabase-js";
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import * as MailComposer from 'expo-mail-composer';
import { useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AdsConsent } from "react-native-google-mobile-ads";

const Settings = () => {
    const [user, setUser] = useState<User | undefined>();
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const openRawGist = async (file: string) => {
        const url = file === "privacy" ? "https://gist.github.com/JohnCervantes/6a098645d13c5dcfcb9a250d2f42af70#file-posi-news-privacy-policy-md" : 'https://gist.github.com/JohnCervantes/6a098645d13c5dcfcb9a250d2f42af70#file-posi-news-terms-of-service-md'
        await WebBrowser.openBrowserAsync(url);
    };

    const handleAdPreferences = async () => {
        try {
            await AdsConsent.requestInfoUpdate();
            await AdsConsent.showPrivacyOptionsForm();
        } catch (e: unknown) {
            if (e instanceof Error)
                Alert.alert("Privacy form failed to open:", e.message);
        }
    };

    const handleDeleteAccount = async () => {
        const { data, error } = await supabase.functions.invoke('delete-user');

        if (!error) {
            await supabase.auth.signOut();
            router.replace('/');
        } else {
            setShowModal(false)
        }
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            router.replace('/');
        }
    };

    const handleSupportPress = async () => {
        const isAvailable = await MailComposer.isAvailableAsync();
        const version = Application.nativeApplicationVersion;
        const deviceModel = Device.modelName;
        const osVersion = Device.osVersion;

        if (isAvailable) {
            MailComposer.composeAsync({
                recipients: ['badsealsup@gmail.com'],
                subject: `Support: Posi News v${version}`,
                body: `
      
      --- Diagnostic Info ---
      App Version: ${version}
      Device: ${deviceModel}
      OS: ${osVersion}
    `,
            });
        } else {
            Alert.alert(
                "Email Not Setup",
                "Please email us directly at badsealsup@gmail.com"
            );
        }
    };

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user)
                setUser(user);
        }
        getUser();
    }, []);

    return (<View>
        <Text style={styles.label}>LEGAL & SUPPORT</Text>
        <View style={styles.settingsContainer}>
            <Pressable onPress={() => openRawGist("privacy")} style={({ pressed }) => [styles.setting, {
                opacity: pressed ? 0.5 : 1
            }]}>
                <View style={{ flexDirection: "row", columnGap: 16 }}>
                    <Ionicons name="shield" size={28} color={"lightblue"}></Ionicons>
                    <Text style={styles.settingText}>Privacy Policy</Text>
                </View>

                <Ionicons name="chevron-forward" size={28} color={"gray"}></Ionicons>
            </Pressable>

            <Pressable onPress={() => openRawGist("terms")} style={({ pressed }) => [styles.setting, {
                opacity: pressed ? 0.5 : 1
            }]}>
                <View style={{ flexDirection: "row", columnGap: 16 }}>
                    <Ionicons name="document-text" size={28} color={"lightgreen"}></Ionicons>
                    <Text style={styles.settingText}>Terms Of Service</Text>
                </View>

                <Ionicons name="chevron-forward" size={28} color={"gray"}></Ionicons>
            </Pressable>
            <Pressable onPress={handleAdPreferences} style={({ pressed }) => [styles.setting, {
                opacity: pressed ? 0.5 : 1
            }]}>
                <View style={{ flexDirection: "row", columnGap: 16 }}>
                    <Ionicons name="checkbox-outline" size={28} color={"brown"}></Ionicons>
                    <Text style={styles.settingText}>Ad Preferences</Text>
                </View>

                <Ionicons name="chevron-forward" size={28} color={"gray"}></Ionicons>
            </Pressable>
            <Pressable onPress={handleSupportPress} style={({ pressed }) => [styles.setting, {
                opacity: pressed ? 0.5 : 1
            }]}>
                <View style={{ flexDirection: "row", columnGap: 16 }}>
                    <Ionicons name="help-circle" size={28} color={"orange"}></Ionicons>
                    <Text style={styles.settingText}>Help & Support</Text>
                </View>

                <Ionicons name="chevron-forward" size={28} color={"gray"}></Ionicons>
            </Pressable>
        </View>

        <Text style={styles.label}>ACCOUNT MANAGEMENT</Text>
        <View style={styles.settingsContainer}>
            {user ?
                <Pressable onPress={handleLogout} style={({ pressed }) => [styles.setting, {
                    opacity: pressed ? 0.5 : 1
                }]}>
                    <View style={{ flexDirection: "row", columnGap: 16 }}>
                        <Ionicons name="log-out" size={28} color={"gray"}></Ionicons>
                        <Text style={styles.settingText}>Log Out</Text>
                    </View>
                </Pressable> : <Pressable style={({ pressed }) => [styles.setting, {
                    opacity: pressed ? 0.5 : 1
                }]} onPress={() => router.push("/login")} >
                    <View style={{ flexDirection: "row", columnGap: 16 }}>
                        <Ionicons name="log-in" size={28} color={"gray"}></Ionicons>
                        <Text style={styles.settingText}>Log In</Text>
                    </View>
                </Pressable>}
        </View>
        <Pressable style={({ pressed }) => [{
            flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 48,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.5 : 1
        }]
        }
            onPress={() => setShowModal(true)} >
            <Ionicons name="trash-bin" size={28} color={'red'}></Ionicons>
            <Text style={[styles.label, { color: "red", textAlign: "center" }]}>Delete My Account</Text>
        </Pressable>
        <Text style={{ textAlign: "center", fontSize: 12, marginTop: 32 }}>{`Posi News App ${Application.nativeApplicationVersion}`}</Text>
        <TrendyModal visible={showModal} onClose={() => { setShowModal(false) }}>
            <Ionicons name="warning-outline" size={40} color={"red"} />
            <Text style={{ fontSize: 16, fontWeight: 700, margin: 16 }}>Delete Account?</Text>
            <Text style={{ textAlign: "center", fontSize: 16 }}>This action cannot be undone. You will permanently lose ai chat history, and personal preferences.</Text>
            <Pressable onPress={handleDeleteAccount}
                style={({ pressed }) => [{
                    padding: 16, backgroundColor: 'red', borderRadius: 8, marginVertical: 8,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    opacity: pressed ? 0.5 : 1
                }]
                }><Text style={{ color: "white", fontWeight: 500 }}>Delete My Account</Text></Pressable>
            <Pressable onPress={() => setShowModal(false)}
                style={{ padding: 16, borderWidth: 0.5, borderColor: 'gray', borderRadius: 8, marginVertical: 8 }}><Text>Cancel</Text></Pressable>
        </TrendyModal>
    </View>)
}

export default Settings;

const styles = StyleSheet.create({
    label: {
        margin: 16,
        fontWeight: 500
    },
    settingsContainer: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        borderRadius: 8,
    },
    setting: {
        flexDirection: "row", justifyContent: "space-between", padding: 16, borderBottomWidth: 0.2, borderColor: "lightgray"
    },
    settingText: {
        fontSize: 16
    }
})