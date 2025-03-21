<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-center text-blue-500 mb-8">Terms of Use</h1>
    
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <div class="prose prose-blue max-w-none">
        <p class="text-gray-600 mb-6">Last updated: {{ new Date().toLocaleDateString() }}</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using Facebook-Style Chat ("the Service"), you agree to be bound by these Terms of Use 
          ("Terms"), all applicable laws and regulations, and agree that you are responsible for compliance with any 
          applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing 
          the Service. The materials contained in the Service are protected by applicable copyright and trademark law.
        </p>
        
        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use the Service for personal, non-commercial transitory viewing only. 
          This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>attempt to decompile or reverse engineer any software contained in the Service;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
        <p>
          This license shall automatically terminate if you violate any of these restrictions and may be terminated by 
          Facebook-Style Chat at any time. Upon terminating your viewing of these materials or upon the termination of 
          this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
        </p>
        
        <h2>3. Disclaimer</h2>
        <p>
          The materials within the Service are provided on an 'as is' basis. Facebook-Style Chat makes no warranties, 
          expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, 
          implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
          of intellectual property or other violation of rights.
        </p>
        <p>
          Further, Facebook-Style Chat does not warrant or make any representations concerning the accuracy, likely 
          results, or reliability of the use of the materials on the Service or otherwise relating to such materials 
          or on any sites linked to the Service.
        </p>
        
        <h2>4. Limitations</h2>
        <p>
          In no event shall Facebook-Style Chat or its suppliers be liable for any damages (including, without limitation, 
          damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use 
          the Service, even if Facebook-Style Chat or a Facebook-Style Chat authorized representative has been notified 
          orally or in writing of the possibility of such damage.
        </p>
        
        <h2>5. Accuracy of Materials</h2>
        <p>
          The materials appearing on the Service could include technical, typographical, or photographic errors. 
          Facebook-Style Chat does not warrant that any of the materials on the Service are accurate, complete or current. 
          Facebook-Style Chat may make changes to the materials contained on the Service at any time without notice. 
          However, Facebook-Style Chat does not make any commitment to update the materials.
        </p>
        
        <h2>6. Links</h2>
        <p>
          Facebook-Style Chat has not reviewed all of the sites linked to its Service and is not responsible for the 
          contents of any such linked site. The inclusion of any link does not imply endorsement by Facebook-Style Chat 
          of the site. Use of any such linked website is at the user's own risk.
        </p>
        
        <h2>7. Modifications</h2>
        <p>
          Facebook-Style Chat may revise these Terms of Use for its Service at any time without notice. By using the 
          Service, you are agreeing to be bound by the then current version of these Terms of Use.
        </p>
        
        <h2>8. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of the United States, without regard 
          to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be 
          considered a waiver of those rights.
        </p>
        
        <h2>9. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at legal@facebook-style-chat.com.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Terms of Use - Facebook-Style Chat',
    meta: [
      { 
        hid: 'description', 
        name: 'description', 
        content: 'Read the Terms of Use for Facebook-Style Chat. Learn about our policies, licenses, disclaimers, and legal agreements for using our service.' 
      }
    ]
  }
}
</script>