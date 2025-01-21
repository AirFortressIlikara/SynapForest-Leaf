<!--
  Author: Ilikara 3435193369@qq.com
  Date: 2025-01-19 21:38:54
  LastEditors: Ilikara 3435193369@qq.com
  LastEditTime: 2025-01-20 21:34:57
  FilePath: /SynapForest/src/components/App.svelte
  Description: 
  
  Copyright (c) 2025 AirFortressIlikara
  SynapForest is licensed under Mulan PubL v2.
  You can use this software according to the terms and conditions of the Mulan PubL v2.
  You may obtain a copy of Mulan PubL v2 at:
           http://license.coscl.org.cn/MulanPubL-2.0
  THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
  MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
  See the Mulan PubL v2 for more details.
-->
<script>
	import ResizableSidebar from "./ResizableSidebar.svelte";
	import Toolbar from "./Toolbar.svelte";
	import MainContent from "./MainContent.svelte";
	import FolderTree from "./FolderTree.svelte";
</script>

<div class="app">
	<!-- 左边栏 -->
	<ResizableSidebar width={200}>
		<div class="sidebar-content">
			<FolderTree />
		</div>
	</ResizableSidebar>

	<!-- 主区域 -->
	<div class="main-area">
		<Toolbar>Toolbar Content</Toolbar>
		<MainContent>Main Content</MainContent>
	</div>

	<!-- 右边栏 -->
	<ResizableSidebar width={200} isRight={true}>
		<div class="sidebar-content">
			<h2>Right Sidebar</h2>
			<p>This is the right sidebar content.</p>
			<button on:click={() => alert("Button clicked!")}>Click Me</button>
		</div>
	</ResizableSidebar>
</div>

<style>
	.app {
		display: flex;
		height: 100vh;
		width: 100%;
	}

	.main-area {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.sidebar-content {
		padding: 10px;
	}

	.sidebar-content h2 {
		margin-top: 0;
	}
</style>
