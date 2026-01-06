<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { BasicOption } from '@vben/types';

import { computed, markRaw, onMounted, reactive, ref } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';
import { frontLoginInfoInit, getEmergencyPublicKeyApi } from '#/api';
import { doRSAEncrypt, doEncrypt } from '#/utils/rsa';
import { useAccessStore } from '@vben/stores';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const accessStore = useAccessStore();

const loginMode = accessStore.loginMode;
console.log('loginMode==', loginMode);

const MOCK_USER_OPTIONS: BasicOption[] = [
  {
    label: 'Super',
    value: 'vben',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'User',
    value: 'jack',
  },
];

const formSchema = computed((): VbenFormSchema[] => {
  return [
    // {
    //   component: 'VbenSelect',
    //   componentProps: {
    //     options: MOCK_USER_OPTIONS,
    //     placeholder: $t('authentication.selectAccount'),
    //   },
    //   fieldName: 'selectAccount',
    //   label: $t('authentication.selectAccount'),
    //   rules: z
    //     .string()
    //     .min(1, { message: $t('authentication.selectAccount') })
    //     .optional()
    //     .default('vben'),
    // },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      dependencies: {
        trigger(values, form) {
          form.setValues({
            password: loginMode === 'Escape2' ? '111111' : '',
            username: loginMode === 'Escape2' ? 'fengwei3@csg.cn' : '',
          });
        },
        triggerFields: ['selectAccount'],
      },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    },
  ];
});
const rsaPublicKey = ref();
onMounted(async () => {
  // if (loginMode === 'Escape2') {
  //   rsaPublicKey.value = await frontLoginInfoInit();
  //   console.log(rsaPublicKey.value);
  // }
  if (loginMode !== 'Escape2') {
    rsaPublicKey.value = await getEmergencyPublicKeyApi();
    console.log(rsaPublicKey.value);
  }
});

const submitLogin = (params: any) => {
  if (loginMode === 'Escape2') {
    let orginString = params.username + ';;' + params.password;
    // let encrypt = doRSAEncrypt(rsaPublicKey.value, orginString);
    authStore.authLogin({ encryptLoginInfo: orginString });
  } else {
    let encryptPassword = doEncrypt(rsaPublicKey.value, params.password);
    authStore.authLogin({
      username: params.username,
      password: encryptPassword,
    });
  }
};
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="submitLogin"
  />
</template>
