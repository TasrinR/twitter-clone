import PropsHandler from '@/lib/middleware/PropsHandler';
import { getAllProfilePosts } from '@/lib/services/PostService';
import { getUserInfo } from '@/lib/services/userProfileService';
import ProfileSection from '@/sections/ProfileSection'
import React from 'react'

const index = ({posts, userInfo}) => {
  return <ProfileSection posts={posts} userInfo={userInfo} />
}

export default index;

export async function getServerSideProps(context) {
  let id = context.params?.id;
  let req = {
    query: {
      id,
    }
  }
  let postResponse = await PropsHandler(getAllProfilePosts, req);
  postResponse = JSON.parse(JSON.stringify(postResponse));

  let profileResponse = await PropsHandler(getUserInfo, req);
  profileResponse = JSON.parse(JSON.stringify(profileResponse));
  return {
    props: {
      posts: postResponse.result,
      userInfo: profileResponse.result
    },
  };
}