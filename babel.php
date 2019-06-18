<?php

$transpile_tag_template_literals_templates_map_name = 'TEMPLATES_MAP';
$transpile_tag_template_literals_inc = 0;
$transpile_tag_template_literals_templates = [];

function transpile_tag_template_literals ($content) {
    return preg_replace_callback(
        '/(?<fn>[^\s`]+)`(?<content>[^`]*)`/',
        function ($matches) {
            global $transpile_tag_template_literals_templates_map_name, $transpile_tag_template_literals_inc, $transpile_tag_template_literals_templates;

            [
                'fn' => $fn,
                'content' => $content
            ] = $matches;

            $i = 0;

            $matches = array_map(function ($match) use (&$i) {
                if ($i++ % 2 === 0) {
                    return preg_replace('/\n+/', '', str_replace('\'', '\\\'', $match));
                }
                return $match;
            }, preg_split('/(\$\{\s*)|(\s+\}(?="|>|<))/', $content));

            $transpile_tag_template_literals_templates[] = array_filter($matches, function ($i) {
                return $i % 2 === 0;
            }, ARRAY_FILTER_USE_KEY);

            $args = array_filter($matches, function ($i) {
                return $i % 2 !== 0;
            }, ARRAY_FILTER_USE_KEY);

            $string = $fn . '(' . $transpile_tag_template_literals_templates_map_name . '.get(' . $transpile_tag_template_literals_inc++ .')';
            if (count($args) !== 0) {
                $string .= ", ";
            }
    
            $i = 0;
            foreach ($args as $arg) {
                $string .= "$arg";
                if ($i++ !== count($args) - 1) {
                    $string .= ", ";
                }
            }
    
            return $string .= ")";
        },
        $content
    );
}

function transpile (string $file) {
    $functions = [
        'transpile_tag_template_literals'
    ];

    return array_reduce($functions, function ($content, $fn) {
        return $fn($content);
    }, $file);
}

function head_transpilation_result () {
    global $transpile_tag_template_literals_templates_map_name, $transpile_tag_template_literals_templates;

    $string = "const $transpile_tag_template_literals_templates_map_name = new Map([\n";
    
    
    foreach ($transpile_tag_template_literals_templates as $index => $chunks) {
        $string .= "[ $index, [";
        $i = 0;
        foreach ($chunks as $chunk) {
            $string .= "'$chunk'";
            if ($i++ !== count($chunks) - 1) {
                $string .= ', ';
            }
        }
        $string .= "] ]";
        if ($index !== count($transpile_tag_template_literals_templates) - 1) {
            $string .= ",\n";
        }
    }

    $string .= "]);\n";
    return $string;
}
