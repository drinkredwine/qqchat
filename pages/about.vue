<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-4xl font-bold text-center text-blue-500 mb-8">About Us</h1>
    
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 class="text-2xl font-semibold mb-4">Our Story</h2>
      <p class="mb-6 text-gray-700">
        Founded in 2025, Facebook-Style Chat was created with a vision to provide a seamless and intuitive communication platform for users around the world. Our team of passionate developers and designers has worked tirelessly to create an experience that combines the best aspects of modern chat interfaces with innovative features.
      </p>
      
      <h2 class="text-2xl font-semibold mb-4">Our Mission</h2>
      <p class="mb-6 text-gray-700">
        We believe that communication should be simple, secure, and enjoyable. Our mission is to connect people through a user-friendly platform that respects privacy while offering powerful features for both personal and professional use.
      </p>
      
      <h2 class="text-2xl font-semibold mb-4">Our Team</h2>
      <p class="mb-6 text-gray-700">
        Our diverse team brings together expertise from various backgrounds including software engineering, UX design, security, and customer support. We're united by our commitment to creating the best possible chat experience for our users.
      </p>
      
      <h2 class="text-2xl font-semibold mb-4">Our Values</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div class="border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-2 text-blue-500">Privacy First</h3>
          <p class="text-gray-700">We design our platform with privacy as a fundamental principle, ensuring your conversations remain secure and private.</p>
        </div>
        <div class="border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-2 text-blue-500">User-Centered Design</h3>
          <p class="text-gray-700">Every feature we build starts with understanding our users' needs and preferences.</p>
        </div>
        <div class="border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-2 text-blue-500">Continuous Improvement</h3>
          <p class="text-gray-700">We're constantly working to enhance our platform based on user feedback and technological advancements.</p>
        </div>
        <div class="border border-gray-200 rounded-lg p-6">
          <h3 class="text-xl font-semibold mb-2 text-blue-500">Inclusive Communication</h3>
          <p class="text-gray-700">We strive to make our platform accessible and welcoming to users from all backgrounds and abilities.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head: {
    title: 'About Us - Facebook-Style Chat',
    meta: [
      { 
        hid: 'description', 
        name: 'description', 
        content: 'Learn about the team and story behind Facebook-Style Chat, our mission, values, and commitment to privacy-focused communication.' 
      }
    ]
  }
}
</script>