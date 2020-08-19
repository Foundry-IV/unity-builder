import { exec } from '@actions/exec';
import ImageTag from './image-tag';

class Docker {
  static async build(buildParameters, silent = false) {
    const { path, dockerfile, baseImage } = buildParameters;
    const { version, platform, repository, name } = baseImage;

    let tag;
    let command;
    if (repository !== 'gableroux') {
      tag = new ImageTag({ repository, name: 'unity-builder', version, platform });
      command = `docker build ${path} \
      --file ${dockerfile} \
      --build-arg IMAGE=${repository}/${name} \
      --tag ${tag}`;
    } else {
      tag = new ImageTag({ repository: '', name: 'unity-builder', version, platform });
      command = `docker build ${path} \
      --file ${dockerfile} \
      --build-arg IMAGE=${baseImage} \
      --tag ${tag}`;
    }

    await exec(command, null, { silent });

    return tag;
  }

  static async run(image, parameters, silent = false) {
    const {
      version,
      workspace,
      platform,
      projectPath,
      buildName,
      buildPath,
      buildFile,
      buildMethod,
      customParameters,
    } = parameters;

    const command = `docker run \
        --workdir /github/workspace \
        --rm \
        --env UNITY_LICENSE \
        --env UNITY_LICENSE_FILE \
        --env UNITY_EMAIL \
        --env UNITY_PASSWORD \
        --env UNITY_SERIAL \
        --env UNITY_VERSION="${version}" \
        --env PROJECT_PATH="${projectPath}" \
        --env BUILD_TARGET="${platform}" \
        --env BUILD_NAME="${buildName}" \
        --env BUILD_PATH="${buildPath}" \
        --env BUILD_FILE="${buildFile}" \
        --env BUILD_METHOD="${buildMethod}" \
        --env CUSTOM_PARAMETERS="${customParameters}" \
        --env HOME=/github/home \
        --env ANDROID_KEYSTORE_BASE64 \
        --env BUILD_APP_BUNDLE \
        --env KEYSTORE_PASS \
        --env KEY_ALIAS_NAME \
        --env  KEY_ALIAS_PASS \
        --env GITHUB_REF \
        --env GITHUB_SHA \
        --env GITHUB_REPOSITORY \
        --env GITHUB_ACTOR \
        --env GITHUB_WORKFLOW \
        --env GITHUB_HEAD_REF \
        --env GITHUB_BASE_REF \
        --env GITHUB_EVENT_NAME \
        --env GITHUB_WORKSPACE=/github/workspace \
        --env GITHUB_ACTION \
        --env GITHUB_EVENT_PATH \
        --env RUNNER_OS \
        --env RUNNER_TOOL_CACHE \
        --env RUNNER_TEMP \
        --env RUNNER_WORKSPACE \
        --volume "/var/run/docker.sock":"/var/run/docker.sock" \
        --volume "/home/runner/work/_temp/_github_home":"/github/home" \
        --volume "/home/runner/work/_temp/_github_workflow":"/github/workflow" \
        --volume "${workspace}":"/github/workspace" \
        ${image}`;

    await exec(command, null, { silent });
  }
}

export default Docker;
