<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-center text-blue-500 mb-8">Privacy Policy</h1>
    
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div class="prose prose-blue max-w-none">
        <p class="text-gray-600 mb-6">Last updated: {{ new Date().toLocaleDateString() }}</p>
        
        <p class="mb-6">
          At Facebook-Style Chat, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
          and safeguard your information when you use our communication platform. Please read this privacy policy carefully. 
          If you do not agree with the terms of this privacy policy, please do not access the application.
        </p>
        
        <h2>1. Collection of Your Information</h2>
        <p>We may collect information about you in a variety of ways. The information we may collect via the Service includes:</p>
        
        <h3>1.1 Personal Data</h3>
        <p>
          Personally identifiable information, such as your name, email address, and telephone number, that you voluntarily 
          give to us when you register with the Service or when you choose to participate in various activities related to 
          the Service. You are under no obligation to provide us with personal information of any kind, however your refusal 
          to do so may prevent you from using certain features of the Service.
        </p>
        
        <h3>1.2 Derivative Data</h3>
        <p>
          Information our servers automatically collect when you access the Service, such as your IP address, your browser type, 
          your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.
        </p>
        
        <h3>1.3 Mobile Device Data</h3>
        <p>
          Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your 
          device, if you access the Service from a mobile device.
        </p>
        
        <h3>1.4 Data From Contests, Giveaways, and Surveys</h3>
        <p>
          Personal and other information you may provide when entering contests or giveaways and/or responding to surveys.
        </p>
        
        <h2>2. Use of Your Information</h2>
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:</p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
          <li>Email you regarding your account or order.</li>
          <li>Enable user-to-user communications.</li>
          <li>Generate a personal profile about you to make future visits to the Service more personalized.</li>
          <li>Increase the efficiency and operation of the Service.</li>
          <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
          <li>Notify you of updates to the Service.</li>
          <li>Perform other business activities as needed.</li>
          <li>Request feedback and contact you about your use of the Service.</li>
          <li>Resolve disputes and troubleshoot problems.</li>
          <li>Respond to product and customer service requests.</li>
        </ul>
        
        <h2>3. Disclosure of Your Information</h2>
        <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
        
        <h3>3.1 By Law or to Protect Rights</h3>
        <p>
          If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy 
          potential violations of our policies, or to protect the rights, property, and safety of others, we may share your 
          information as permitted or required by any applicable law, rule, or regulation.
        </p>
        
        <h3>3.2 Third-Party Service Providers</h3>
        <p>
          We may share your information with third parties that perform services for us or on our behalf, including payment 
          processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
        </p>
        
        <h3>3.3 Marketing Communications</h3>
        <p>
          With your consent, or with an opportunity for you to withdraw consent, we may share your information with third 
          parties for marketing purposes, as permitted by law.
        </p>
        
        <h3>3.4 Interactions with Other Users</h3>
        <p>
          If you interact with other users of the Service, those users may see your name, profile photo, and descriptions 
          of your activity, including sending invitations to other users, chatting with other users, liking posts, following blogs.
        </p>
        
        <h3>3.5 Online Postings</h3>
        <p>
          When you post comments, contributions or other content to the Service, your posts may be viewed by all users and 
          may be publicly distributed outside the Service in perpetuity.
        </p>
        
        <h2>4. Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While 
          we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite 
          our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed 
          against any interception or other type of misuse.
        </p>
        
        <h2>5. Policy for Children</h2>
        <p>
          We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any 
          data we have collected from children under age 13, please contact us using the contact information provided below.
        </p>
        
        <h2>6. Controls for Do-Not-Track Features</h2>
        <p>
          Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can 
          activate to signal your privacy preference not to have data about your online browsing activities monitored and 
          collected. No uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, 
          we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your 
          choice not to be tracked online.
        </p>
        
        <h2>7. Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at:
        </p>
        <p>
          Facebook-Style Chat<br>
          123 Chat Avenue<br>
          San Francisco, CA 94107<br>
          privacy@facebook-style-chat.com<br>
          (555) 123-4567
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Privacy Policy - Facebook-Style Chat',
    meta: [
      { 
        hid: 'description', 
        name: 'description', 
        content: 'Read our Privacy Policy to understand how Facebook-Style Chat collects, uses, and protects your personal information when using our service.' 
      }
    ]
  }
}
</script>