<template>
    <div class="home">
      <h1>🔥最近文章</h1>
      <ul class="list-container">
        <li class="list-item" v-for="post in recentPosts" :key="post.path">
          <a :href="post.path">{{ post.title }}</a>
          <span class="date">{{ post.date }}</span>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const recentPosts = ref([]);
  
  onMounted(async () => {
    const posts = await import.meta.glob('../../../docs/**/*.md', { eager: true });
    const postList = Object.entries(posts).map(([path, post]) => {
      const { __pageData } = post;
      return {
        path: path.replace('../../../docs', '').replace('.md', '.html'),
        title: __pageData.title,
        date: new Date(__pageData.lastUpdated).toLocaleString() || '未知日期',
      };
    });
  
    // 根据日期排序
    postList.sort((a, b) => new Date(b.date) - new Date(a.date));
    const showList = postList.filter(item => item.title).slice(0, 12)
    console.log("🚀 ~ onMounted ~ showList:", showList)
  
    recentPosts.value = showList; // 显示最近文章
  });
  </script>
  
  <style scoped>
  .home {
    margin-top: 50px;
  }
  
  .list-container {
    display: flex;
    flex-wrap: wrap;
    list-style-type: none;
    padding: 0;
    width: 100%;
  }
  
  .list-item {
    margin-bottom: 10px;
    margin: 0;
    margin-left: 10px;
    height: 50px;
    line-height: 50px;
  }
  
  .date {
    margin-left: 10px;
    color: #666;
  }
  </style>