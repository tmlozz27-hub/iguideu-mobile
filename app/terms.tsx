import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TermsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 8 }}>
          Terms of Service
        </Text>

        <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
          Last Updated: March 16, 2026
        </Text>

        <Text style={{ fontSize: 16, lineHeight: 24, color: "#374151", marginBottom: 16 }}>
          These Terms of Service ("Terms") govern your access to and use of the I GUIDE U mobile application, website, and related services (the "Platform"). The Platform is operated by Aurora Galactic LLC. By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree with these Terms, you may not use the Platform.
        </Text>

        <Section
          title="1. Platform Overview"
          body="I GUIDE U is a marketplace that connects travelers with independent local guides who offer guided experiences. I GUIDE U does not own, create, organize, sell, resell, manage, or control the guided experiences offered by guides. Guides are independent providers responsible for their own services."
        />

        <Section
          title="2. User Accounts"
          body="To use certain features of the Platform, you must create an account. You agree to provide accurate and complete information, maintain the security of your account, and remain responsible for all activity under your account. You must be at least 18 years old to create an account and use the Platform."
        />

        <Section
          title="3. Bookings"
          body="Travelers may book guided experiences through the Platform. When a booking is made, the traveler agrees to pay the listed price and the guide agrees to provide the experience as described. Once a booking is confirmed, both parties agree to the reservation."
        />

        <Section
          title="4. Payments"
          body="Payments are processed through third-party payment providers. By making a booking, you authorize the payment processor to charge the applicable amount. I GUIDE U may collect service fees or platform commissions in connection with bookings. Platform fees may be applied to bookings and may vary depending on the service or location. Payment processing services are provided by external providers such as Stripe. I GUIDE U does not store full credit card information."
        />

        <Section
          title="5. Cancellations and Refunds"
          body="Cancellation and refund policies may vary depending on the guide and the specific experience. Details about cancellation terms may be displayed at the time of booking. In certain situations, I GUIDE U may facilitate refunds or dispute resolution between travelers and guides. Additional refund rules may be described in the Refund and Cancellation Policy."
        />

        <Section
          title="6. Communication Between Users"
          body="The Platform may allow travelers and guides to communicate through an integrated messaging system. Users agree to use this system respectfully and only for purposes related to the booking. Harassment, spam, abuse, or misuse of the communication system is not permitted."
        />

        <Section
          title="7. Prohibited Activities"
          body="Users agree not to use the Platform for illegal activities, provide false or misleading information, interfere with the operation of the Platform, attempt to bypass payment systems, or contact users outside the Platform to avoid service fees. Violation of these rules may result in suspension or termination of the account."
        />

        <Section
          title="8. Guide Responsibilities"
          body="Guides are responsible for providing accurate descriptions of their services, complying with local laws and regulations, and ensuring the safety and quality of their experiences. I GUIDE U does not guarantee the quality, legality, or safety of guide services."
        />

        <Section
          title="9. Platform Availability"
          body="We strive to keep the Platform available and functional at all times. However, the Platform may occasionally be unavailable due to maintenance, updates, technical issues, or factors outside our control. I GUIDE U does not guarantee uninterrupted access."
        />

        <Section
          title="10. Limitation of Liability"
          body="To the maximum extent permitted by law, I GUIDE U and Aurora Galactic LLC shall not be liable for indirect, incidental, special, consequential, or punitive damages, loss of profits or business, or damages arising from interactions between travelers and guides. Guided experiences are provided by independent guides. I GUIDE U acts solely as an intermediary technology platform."
        />

        <Section
          title="11. Indemnification"
          body="Users agree to indemnify and hold harmless I GUIDE U and Aurora Galactic LLC from claims, liabilities, damages, losses, and expenses arising from misuse of the Platform, violation of these Terms, disputes between travelers and guides, or unlawful conduct connected to use of the Platform."
        />

        <Section
          title="12. Termination"
          body="We may suspend or terminate accounts that violate these Terms, misuse the Platform, create safety concerns, or expose the Platform or its users to legal or operational risk. Users may also stop using the Platform at any time."
        />

        <Section
          title="13. Modifications to the Terms"
          body="We may update these Terms periodically. Updated Terms will be published on the Platform with a revised date. Continued use of the Platform after such updates constitutes acceptance of the updated Terms."
        />

        <Section
          title="14. Governing Law"
          body="These Terms shall be governed by and interpreted in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles."
        />

        <Section
          title="15. Contact Information"
          body="If you have questions about these Terms, you may contact us at support@i-guide-u.com."
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