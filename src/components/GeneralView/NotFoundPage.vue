<template>
    <div class="container " style="margin-top: 8rem;">
        <div class="row justify-content-center">
            <div class="col-md-6 text-center">
                <h1 class="text-danger">404 Not Found</h1>
                <h5>Woops, Look like this page doesn't exist</h5>
                <button class="mt-3 btn btn-danger" @click="$router.back()">Go Back</button>
                <button class="mt-3 btn btn-warning ml-3" @click="$router.push('/')">Dashboard</button>
            </div>
        </div>
    </div>
</template>
