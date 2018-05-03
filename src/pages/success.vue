<template>
    <div class="container">
        <q-icon name="done all" color="primary" />
        <h2>提交成功</h2>
        <div class="footer">
            <p><img src="../statics/img/logo.svg" />未命名 - 智能问卷系统</p>
            <q-btn color="primary" label="立即体验" @click="$router.push('/')"></q-btn>
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped>
.container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .q-icon {
        font-size: 3em;
    }
}

.footer {
    position: fixed;
    bottom: 2em;
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;

    img {
        vertical-align: middle;
        margin-right: 0.5em;
        width: 2em;
        height: 2em;
    }

    p {
        font-weight: 500;
    }
}
</style>