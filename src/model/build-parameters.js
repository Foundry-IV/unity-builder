import Platform from './platform';

class BuildParameters {
  static create(parameters) {
    const {
      unityVersion,
      targetPlatform,
      projectPath,
      buildName,
      buildsPath,
      buildMethod,
      customParameters,
    } = parameters;

    return {
      version: unityVersion,
      platform: targetPlatform,
      projectPath,
      buildName,
      buildPath: `${buildsPath}/${targetPlatform}`,
      buildFile: this.parseBuildFile(buildName, targetPlatform, customParameters),
      buildMethod,
      customParameters,
    };
  }

  static parseBuildFile(filename, platform, customParameters) {
    if (Platform.isWindows(platform)) {
      return `${filename}.exe`;
    }

    if (Platform.isAndroid(platform)) {
      const extension =
        Object.prototype.hasOwnProperty.call(customParameters, 'buildAppBundle') &&
        customParameters.valueOf('buildAppBundle').toString() === 'true'
          ? 'aab'
          : 'apk';
      return `${filename}.${extension}`;
    }

    return filename;
  }
}

export default BuildParameters;
