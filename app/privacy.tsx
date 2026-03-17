import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 8 }}>
          Privacy Policy
        </Text>

        <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
          Last Updated: March 16, 2026
        </Text>

        <Text style={{ fontSize: 16, lineHeight: 24, color: "#374151", marginBottom: 16 }}>
          This Privacy Policy explains how I GUIDE U ("we", "our", or "us") collects, uses, and protects your information when you use the I GUIDE U mobile application and related services. I GUIDE U is operated by Aurora Galactic LLC. By using the application, you agree to the collection and use of information in accordance with this policy.
        </Text>

        <Section
          title="1. Information We Collect"
          body="We collect information that you provide directly to us when you use the Platform."
        />

        <SubSection
          title="Account Information"
          body="When you create an account, we may collect your name, email address, phone number, account credentials, and profile information."
        />

        <SubSection
          title="Booking Information"
          body="When you make a reservation with a guide, we collect information related to the booking, including booking details, guide information, date and time of the experience, and messages exchanged through the Platform."
        />

        <SubSection
          title="Location Information"
          body="With your permission, the application may collect location data from your device in order to show nearby guides, calculate distance between users and guides, and improve the relevance of search results. Location data is used only while using the application and may be processed temporarily to provide services."
        />

        <SubSection
          title="Payment Information"
          body="Payments are processed by third-party payment providers. I GUIDE U does not store full credit card information. Payment data is securely processed by Stripe or other payment processors. Payments may be handled by PCI-compliant payment processors."
        />

        <SubSection
          title="Usage Information"
          body="We may collect technical information about how the application is used, including device type, operating system, application usage data, and log information. This data helps us improve performance, security, and user experience."
        />

        <Section
          title="2. How We Use Information"
          body="We use the collected information to operate and improve the Platform. This includes creating and managing user accounts, enabling communication between travelers and guides, processing bookings and reservations, facilitating payments, improving search and location features, maintaining platform security, and complying with legal obligations."
        />

        <Section
          title="3. How We Share Information"
          body="We do not sell personal data. Information may be shared only when necessary to operate the service."
        />

        <SubSection
          title="With Guides and Travelers"
          body="When a booking is made, certain information is shared between the traveler and the guide to allow the experience to take place."
        />

        <SubSection
          title="With Service Providers"
          body="We may share information with trusted service providers that help operate the Platform, including payment processors, cloud hosting providers, analytics services, and other providers that support core platform functions. These providers only receive the information necessary to perform their services."
        />

        <SubSection
          title="Legal Requirements"
          body="We may disclose information if required by law, regulation, court order, or legal process, or when necessary to protect rights, safety, or the integrity of the Platform."
        />

        <Section
          title="4. Data Security"
          body="We implement reasonable technical and organizational measures to protect user information. However, no method of transmission over the internet or electronic storage is completely secure. While we strive to protect your information, we cannot guarantee absolute security."
        />

        <Section
          title="5. Data Retention"
          body="We retain personal information only for as long as necessary to provide the services, comply with legal obligations, resolve disputes, and enforce agreements. When data is no longer required, it may be deleted or anonymized where appropriate."
        />

        <Section
          title="6. International Use"
          body="I GUIDE U is available globally. By using the Platform, you acknowledge that your information may be processed and stored in countries where data protection laws may differ from those in your country of residence."
        />

        <Section
          title="7. Children's Privacy"
          body="The Platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided personal information, we may remove that information from our systems."
        />

        <Section
          title="8. Your Rights"
          body="Depending on your location, you may have rights regarding your personal information. These rights may include accessing your personal data, requesting corrections, requesting deletion of your data, and withdrawing consent for certain processing activities. Requests may be submitted through the contact information provided below."
        />

        <Section
          title="9. Third-Party Services"
          body="The Platform may include links or integrations with third-party services. These services have their own privacy policies and practices, and we are not responsible for them."
        />

        <Section
          title="10. Changes to This Policy"
          body="We may update this Privacy Policy from time to time. When updates occur, the revised policy will be posted within the application with an updated revision date. Continued use of the service after updates constitutes acceptance of the updated policy."
        />

        <Section
          title="11. Contact"
          body="If you have questions about this Privacy Policy, you may contact us at support@i-guide-u.com."
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 24, color: "#374151" }}>
        {body}
      </Text>
    </View>
  );
}

function SubSection({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827", marginBottom: 6 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 16, lineHeight: 24, color: "#374151" }}>
        {body}
      </Text>
    </View>
  );
}