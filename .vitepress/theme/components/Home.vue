<template>
  <div class="home">
    <h1>🔥最近文章</h1>
    <div class="list-container">
      <div class="list-item" v-for="post in recentPosts" :key="post.path">
        <div class="card">
          <a class="title" :href="post.path">{{ post.title }}</a>
          <span class="date">{{ post.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const recentPosts = ref([]);
const HOME_PAGE_NAME = "修仙前传";

onMounted(async () => {
  const posts = await import.meta.glob("../../../docs/**/*.md", {
    eager: true,
  });
  const filterList = [];
  Object.entries(posts).forEach(([path, post]) => {
    const { __pageData } = post;
    const { title, lastUpdated } = __pageData;
    if (title && title !== HOME_PAGE_NAME) {
      filterList.push({
        path: path.replace("../../../docs", "").replace(".md", ".html"),
        title,
        date: new Date(lastUpdated).toLocaleString() || "未知日期",
      });
    }
  });

  // 根据日期排序
  filterList.sort((a, b) => new Date(b.date) - new Date(a.date));
  const showList = filterList.slice(0, 12);
  console.log("🚀 ~ onMounted ~ showList:", showList);

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
  margin: -8px;
  margin-top: 20px;
}

.list-item {
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
}
@media (min-width: 768px) {
  .list-item {
    width: calc(100% / 2);
  }
}
@media (min-width: 960px) {
  .list-item {
    width: calc(100% / 4);
  }
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  height: 100%;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
}
.title {
}
.date {
  margin-top: 5px;
  color: var(--vp-c-text-2);
}
</style>
